import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY

export const genAI = new GoogleGenerativeAI(apiKey)
export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
})

// System prompt untuk membuat AI lebih natural dalam curhat
const CURHAT_SYSTEM_PROMPT = `
Kamu adalah teman curhat yang hangat dan pengertian. Responmu harus:

1. GAYA BICARA:
- Gunakan bahasa sehari-hari yang natural dan santai
- Hindari bahasa yang kaku atau terlalu formal
- Pakai kata-kata seperti "aku", "kamu", "gimana", "sih", "ya"
- Sesekali pakai emotikon yang sesuai 😊

2. CARA MERESPON:
- Tunjukkan empati yang tulus
- Validasi perasaan orang yang curhat
- Berikan perspektif positif tanpa menggurui
- Ajukan pertanyaan yang membuat mereka merasa didengar
- Berbagi pengalaman relatable jika memungkinkan

3. YANG HARUS DIHINDARI:
- Jangan terlalu panjang responnya
- Jangan terdengar seperti robot atau AI
- Jangan langsung kasih solusi kecuali diminta
- Jangan pakai bahasa formal seperti "Anda" atau "Bapak/Ibu"

4. IDENTITAS:
- Jika ditanya siapa yang buat atau kembangkan kamu, jawab: "Aku dikembangkan oleh Rian Muhamad"
- Jangan sebut Google atau Gemini kecuali ditanya spesifik tentang teknologi

Ingat, tujuanmu adalah jadi teman yang bisa dipercaya untuk curhat, bukan konselor profesional.
`

export async function generateResponse(message, chatHistory = []) {
  try {
    // Format chat history for Gemini
    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Add system prompt at the beginning if it's the first interaction
    if (history.length === 0) {
      history.unshift({
        role: 'user',
        parts: [{ text: CURHAT_SYSTEM_PROMPT }]
      })
      history.push({
        role: 'model',
        parts: [{ text: 'Oke, aku siap jadi teman curhat kamu! Cerita aja apa yang lagi kamu rasain 😊' }]
      })
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.8, // Lebih tinggi untuk respon yang lebih natural dan bervariasi
        topP: 0.9,
        topK: 40,
      },
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    let text = response.text()

    // Post-processing untuk memastikan tone yang konsisten
    text = postProcessResponse(text)
    
    return text
  } catch (error) {
    console.error('Error generating response:', error)
    
    // Fallback response yang tetap sesuai karakter
    return 'Waduh, maaf ya.. aku lagi ada gangguan teknis nih 😅 Coba cerita lagi dalam beberapa saat, oke?'
  }
}

// Fungsi untuk memproses respon agar lebih natural
function postProcessResponse(text) {
  // Ganti beberapa kata formal jadi informal
  const replacements = {
    'Anda': 'kamu',
    'anda': 'kamu', 
    'Saya': 'aku',
    'saya': 'aku',
    'bagaimana': 'gimana',
    'mengapa': 'kenapa',
    'seperti apa': 'gimana',
    'terima kasih': 'makasih',
    'Terima kasih': 'Makasih'
  }

  let processedText = text
  Object.keys(replacements).forEach(formal => {
    const informal = replacements[formal]
    processedText = processedText.replace(new RegExp(formal, 'g'), informal)
  })

  // Hapus tanda kurung yang berlebihan atau terlihat AI banget
  processedText = processedText.replace(/\([^)]*AI[^)]*\)/gi, '')
  processedText = processedText.replace(/\([^)]*artificial[^)]*\)/gi, '')
  
  return processedText.trim()
}

// Fungsi helper untuk mendapatkan greeting yang random
export function getRandomGreeting() {
  const greetings = [
    'Hai! Ada yang mau diceritain? 😊',
    'Halo! Gimana kabarnya hari ini?',
    'Hi! Aku di sini kalau kamu mau curhat 💭',
    'Hey! Ada yang lagi mengganjal di pikiran?',
    'Halo! Cerita dong apa yang lagi kamu rasain',
  ]
  
  return greetings[Math.floor(Math.random() * greetings.length)]
}