import OpenAI from 'openai'

// OpenAI Client Configuration
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Default model configurations
export const AI_MODELS = {
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo-preview',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_3_5_TURBO_16K: 'gpt-3.5-turbo-16k'
} as const

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS]

// Model configurations for different use cases
export const MODEL_CONFIGS = {
  [AI_MODELS.GPT_4]: {
    maxTokens: 8192,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    bestFor: ['complex analysis', 'reasoning', 'code generation']
  },
  [AI_MODELS.GPT_4_TURBO]: {
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    bestFor: ['fast responses', 'general tasks', 'conversations']
  },
  [AI_MODELS.GPT_3_5_TURBO]: {
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    bestFor: ['quick tasks', 'simple analysis', 'cost-effective operations']
  },
  [AI_MODELS.GPT_3_5_TURBO_16K]: {
    maxTokens: 16384,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    bestFor: ['long documents', 'extensive context', 'detailed analysis']
  }
} as const

// Utility functions for OpenAI operations
export async function generateCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: {
    model?: AIModel
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  } = {}
): Promise<string> {
  const {
    model = AI_MODELS.GPT_3_5_TURBO,
    temperature = 0.7,
    maxTokens = 1000,
    systemPrompt
  } = options

  try {
    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: systemPrompt || 'You are a helpful AI assistant for an HR management system.'
    }

    const allMessages = systemPrompt 
      ? [systemMessage, ...messages]
      : messages

    const completion = await openai.chat.completions.create({
      model,
      messages: allMessages,
      temperature,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error(`Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function generateStructuredCompletion<T>(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  schema: any,
  options: {
    model?: AIModel
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  } = {}
): Promise<T> {
  const {
    model = AI_MODELS.GPT_3_5_TURBO,
    temperature = 0.3, // Lower temperature for structured output
    maxTokens = 2000,
    systemPrompt
  } = options

  try {
    const enhancedSystemPrompt = `${systemPrompt || 'You are a helpful AI assistant for an HR management system.'}\n\nIMPORTANT: You must respond with valid JSON that matches the provided schema. Do not include any text outside the JSON structure.`

    const schemaPrompt = `\n\nRequired JSON Schema:\n${JSON.stringify(schema, null, 2)}`

    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: enhancedSystemPrompt + schemaPrompt
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [systemMessage, ...messages],
      temperature,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    try {
      return JSON.parse(content) as T
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content)
      throw new Error('Invalid JSON response from AI model')
    }
  } catch (error) {
    console.error('OpenAI Structured API Error:', error)
    throw new Error(`Failed to generate structured completion: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function analyzeText(
  text: string,
  analysisType: 'sentiment' | 'classification' | 'extraction' | 'summary',
  options: {
    model?: AIModel
    temperature?: number
    customPrompt?: string
  } = {}
): Promise<any> {
  const {
    model = AI_MODELS.GPT_3_5_TURBO,
    temperature = 0.3,
    customPrompt
  } = options

  const prompts = {
    sentiment: 'Analyze the sentiment of the following text. Return a JSON object with sentiment (positive/negative/neutral), confidence (0-1), and key_phrases array.',
    classification: 'Classify the following text into relevant categories. Return a JSON object with categories array and confidence scores.',
    extraction: 'Extract key information from the following text. Return a JSON object with extracted entities, dates, numbers, and important phrases.',
    summary: 'Summarize the following text concisely. Return a JSON object with summary, key_points array, and word_count.'
  }

  const prompt = customPrompt || prompts[analysisType]

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: `${prompt}\n\nText to analyze:\n${text}`
    }
  ]

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    console.error('Text analysis error:', error)
    throw new Error(`Failed to analyze text: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Embedding functions for semantic search
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Embedding generation error:', error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: texts,
    })

    return response.data.map(item => item.embedding)
  } catch (error) {
    console.error('Batch embedding generation error:', error)
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Utility function to calculate cosine similarity between embeddings
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Rate limiting and error handling
export class OpenAIRateLimiter {
  private requests: number[] = []
  private readonly maxRequestsPerMinute: number

  constructor(maxRequestsPerMinute: number = 60) {
    this.maxRequestsPerMinute = maxRequestsPerMinute
  }

  async checkRateLimit(): Promise<void> {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Remove requests older than 1 minute
    this.requests = this.requests.filter(timestamp => timestamp > oneMinuteAgo)

    if (this.requests.length >= this.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = 60000 - (now - oldestRequest)
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    this.requests.push(now)
  }
}

export const defaultRateLimiter = new OpenAIRateLimiter()
