import { OpenAI } from 'openai'

// Configure a chave API através de variáveis de ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Mova para variável de ambiente
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })

    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: completion.choices[0]?.message?.content
      })
    )

  } catch (error: any) {
    console.error('Error details:', error.response?.data || error.message)
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message,
        status: error.response?.status 
      }),
      { status: 500 }
    )
  }
}