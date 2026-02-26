import { NextRequest, NextResponse } from "next/server";
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
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
        }

        const langchainMessages = [
            new SystemMessage(SYSTEM_PROMPT),
            ...messages.slice(-20).map((msg) =>
                msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
            ),
        ];

        const response = await chatModel.invoke(langchainMessages);
        const content = typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);

        return NextResponse.json({ message: content, usage: response.usage_metadata });
    } catch (error: unknown) {
        console.error("Chat API error:", error);
        const msg = error instanceof Error ? error.message : "Unknown error";

        if (msg.includes("401") || msg.includes("API key")) {
            return NextResponse.json({ error: "API key không hợp lệ." }, { status: 401 });
        }
        if (msg.includes("429")) {
            return NextResponse.json({ error: "Rate limit. Vui lòng thử lại sau." }, { status: 429 });
        }
        return NextResponse.json({ error: "Đã xảy ra lỗi. Vui lòng thử lại." }, { status: 500 });
    }
}
