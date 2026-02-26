import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL || "https://llm.wokushop.com/v1",
    },
    modelName: "gpt-5-chat-latest",
    temperature: 0.7,
    maxTokens: 2048,
    maxRetries: 1,
    streaming: true,
});

const SYSTEM_PROMPT = `Bạn là một trợ lý AI thông minh, thân thiện và hữu ích. Bạn có thể trả lời bằng tiếng Việt hoặc bất kỳ ngôn ngữ nào mà người dùng sử dụng.

Quy tắc:
- Trả lời chính xác, rõ ràng và hữu ích
- Sử dụng markdown formatting khi cần thiết (code blocks, lists, bold, etc.)
- Khi viết code, luôn chỉ rõ ngôn ngữ lập trình
- Nếu không biết câu trả lời, hãy thành thật nói rằng bạn không biết
- Giữ giọng điệu thân thiện và chuyên nghiệp`;

interface MessageInput {
    role: 'user' | 'assistant';
    content: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body as { messages: MessageInput[] };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Messages array is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const langchainMessages = [
            new SystemMessage(SYSTEM_PROMPT),
            ...messages.slice(-20).map((msg) =>
                msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
            ),
        ];

        // Stream response
        const stream = await chatModel.stream(langchainMessages);

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                let tokenCount = 0;
                try {
                    for await (const chunk of stream) {
                        const text = typeof chunk.content === "string" ? chunk.content : "";
                        if (text) {
                            tokenCount++;
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text, tokens: tokenCount })}\n\n`)
                            );
                        }
                    }
                    // Send done signal with final token count
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ done: true, tokens: tokenCount })}\n\n`)
                    );
                } catch (err) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: err instanceof Error ? err.message : "Stream error" })}\n\n`)
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error: unknown) {
        console.error("Chat API error:", error);
        const msg = error instanceof Error ? error.message : "Unknown error";

        if (msg.includes("401") || msg.includes("API key")) {
            return new Response(JSON.stringify({ error: "API key không hợp lệ." }), { status: 401 });
        }
        if (msg.includes("429")) {
            return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429 });
        }
        return new Response(JSON.stringify({ error: "Đã xảy ra lỗi." }), { status: 500 });
    }
}
