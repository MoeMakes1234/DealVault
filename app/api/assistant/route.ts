import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface Deal {
  address: string
  acquisitionPrice: number
  budget: number
  spent: number
  status: string
  expectedProfit: number
  saleTarget?: number
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'AI Assistant is not configured yet. Add an ANTHROPIC_API_KEY environment variable in your Vercel project settings, then redeploy.',
      },
      { status: 200 }
    )
  }

  try {
    const { message, deals, contractors } = (await req.json()) as {
      message: string
      deals: Deal[]
      contractors: { name: string; trade: string; totalPaid: number; rating: number }[]
    }

    const portfolioSummary = deals
      .map(
        (d) =>
          `- ${d.address}: acquired $${d.acquisitionPrice.toLocaleString()}, budget $${d.budget.toLocaleString()}, spent $${d.spent.toLocaleString()}, status ${d.status}, expected profit $${d.expectedProfit.toLocaleString()}${d.saleTarget ? `, target sale $${d.saleTarget.toLocaleString()}` : ''}`
      )
      .join('\n')

    const contractorSummary = (contractors || [])
      .map((c) => `- ${c.name} (${c.trade}): paid $${c.totalPaid.toLocaleString()}, rating ${c.rating}/5`)
      .join('\n')

    const systemPrompt = `You are the AI assistant embedded in DealVault, a real estate developer/flipper project management platform. You help the user analyze their deal pipeline, budgets, and contractor performance. Be concise, concrete, and use real numbers from their portfolio below. Flag risks (over-budget deals, low-rated contractors, thin margins) proactively when relevant. Do not give legal or tax advice beyond general information.

CURRENT PORTFOLIO:
${portfolioSummary || 'No deals yet.'}

CONTRACTORS:
${contractorSummary || 'No contractors logged yet.'}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: `Claude API error: ${errText}` }, { status: 200 })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'No response generated.'

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ error: `Assistant error: ${err.message}` }, { status: 200 })
  }
}
