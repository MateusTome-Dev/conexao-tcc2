import { Groq } from 'groq-sdk'

export const runtime = 'edge'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const completionStream = await groq.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 1024,
      stream: true
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completionStream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              // Formato compatível com o useChat
              const message = {
                id: `chat_${Date.now()}`,
                role: 'assistant',
                content: content
              }
              controller.enqueue(encoder.encode(`${JSON.stringify(message)}\n`))
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error: any) {
    console.error('Groq API error:', error)
    return new Response(JSON.stringify({ 
      error: error?.message || 'API request failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}