import { NextResponse } from 'next/server';

export interface TranslationRequest {
  sourceLang: 'ar' | 'fr' | 'en';
  targetLangs: ('ar' | 'fr' | 'en')[];
  payload: Record<string, string>;
  domainContext?: 'medical_article' | 'doctor_profile' | 'patient_story';
}

// Medical translation dictionary for deterministic fallback
const medicalGlossary: Record<string, { ar: string; fr: string; en: string }> = {
  oncology: { ar: 'طب الأورام والعلاج المناعي', fr: 'Oncologie Médicale & Immunothérapie', en: 'Medical Oncology & Immunotherapy' },
  cardiac: { ar: 'جراحة القلب والأوعية الدموية', fr: 'Chirurgie Cardiovasculaire', en: 'Cardiovascular Surgery' },
  neurosurgery: { ar: 'جراحة المخ والأعصاب وقاع الجمجمة', fr: 'Neurochirurgie & Base du Crâne', en: 'Neurosurgery & Skull Base' },
  orthopedics: { ar: 'جراحة العظام والمفاصل واستبدالها', fr: 'Chirurgie Orthopédique & Prothèses', en: 'Orthopedic Surgery & Joint Replacement' },
  hair: { ar: 'زراعة الشعر المتقدمة بتقنية السفير', fr: 'Greffe Capillaire Avancée Saphir', en: 'Advanced Sapphire Hair Transplantation' },
  dental: { ar: 'طب وتجميل الأسنان وزراعة الفك', fr: 'Dentisterie Esthétique & Implants', en: 'Aesthetic Dentistry & Dental Implants' },
  jci: { ar: 'معتمد من اللجنة الدولية المشتركة JCI', fr: 'Certifié JCI avec Accréditation Internationale', en: 'JCI-Accredited with International Distinction' },
  istanbul: { ar: 'إسطنبول، تركيا', fr: 'Istanbul, Turquie', en: 'Istanbul, Turkey' },
  hospital: { ar: 'مستشفى استشاري معتمد', fr: 'Hôpital de Référence Agréé', en: 'Accredited Referral Hospital' },
  recovery: { ar: 'رحلة تعافي ناجحة ورعاية ممتازة', fr: 'Parcours de Guérison Réussi et Prise en Charge Exemplaire', en: 'Successful Recovery Journey and Exceptional Care' },
};

function fallbackMedicalTranslate(text: string, source: 'ar' | 'fr' | 'en', target: 'ar' | 'fr' | 'en'): string {
  if (!text || text.trim() === '') return '';
  if (source === target) return text;

  let translated = text;

  // Pattern replacements for known medical anchors
  Object.values(medicalGlossary).forEach((item) => {
    const srcTerm = item[source];
    const tgtTerm = item[target];
    if (srcTerm && tgtTerm && translated.includes(srcTerm)) {
      translated = translated.split(srcTerm).join(tgtTerm);
    }
  });

  // Common titles & prefixes
  if (target === 'fr') {
    translated = translated
      .replace(/Prof\. Dr\./g, 'Prof. Dr.')
      .replace(/أ\. د\./g, 'Prof. Dr.')
      .replace(/د\./g, 'Dr.')
      .replace(/مستشفى/g, 'Hôpital')
      .replace(/تركيا/g, 'Turquie')
      .replace(/إسطنبول/g, 'Istanbul')
      .replace(/جراحة/g, 'Chirurgie')
      .replace(/أورام/g, 'Oncologie')
      .replace(/قلب/g, 'Cœur')
      .replace(/سنة خبرة/g, 'ans d’expérience');
  } else if (target === 'en') {
    translated = translated
      .replace(/Prof\. Dr\./g, 'Prof. Dr.')
      .replace(/أ\. د\./g, 'Prof. Dr.')
      .replace(/د\./g, 'Dr.')
      .replace(/مستشفى/g, 'Hospital')
      .replace(/تركيا/g, 'Turkey')
      .replace(/إسطنبول/g, 'Istanbul')
      .replace(/جراحة/g, 'Surgery')
      .replace(/أورام/g, 'Oncology')
      .replace(/قلب/g, 'Cardiac')
      .replace(/سنة خبرة/g, 'years of experience');
  } else if (target === 'ar') {
    translated = translated
      .replace(/Prof\. Dr\./g, 'أ. د.')
      .replace(/Dr\./g, 'د.')
      .replace(/Hospital/g, 'مستشفى')
      .replace(/Hôpital/g, 'مستشفى')
      .replace(/Turkey/g, 'تركيا')
      .replace(/Turquie/g, 'تركيا')
      .replace(/Istanbul/g, 'إسطنبول')
      .replace(/Surgery/g, 'جراحة')
      .replace(/Chirurgie/g, 'جراحة')
      .replace(/Oncology/g, 'أورام')
      .replace(/Cardiac/g, 'قلب');
  }

  return translated;
}

/**
 * Free Neural Google Translate with sentence concatenation and line break preservation
 */
async function translateViaGoogle(text: string, from: 'ar' | 'fr' | 'en', to: 'ar' | 'fr' | 'en'): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Google translate returned ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const combined = data[0].map((item: any) => item[0]).filter(Boolean).join('');
    if (combined && combined.trim()) return combined;
  }
  throw new Error('Invalid translation structure');
}

/**
 * Secondary Neural Backup via MyMemory API
 */
async function translateViaMyMemory(text: string, from: 'ar' | 'fr' | 'en', to: 'ar' | 'fr' | 'en'): Promise<string> {
  const shortText = text.slice(0, 500);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(shortText)}&langpair=${from}|${to}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`MyMemory returned ${res.status}`);
  const data = await res.json();
  if (data?.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  throw new Error('No MyMemory translation');
}

/**
 * Cascading translation orchestrator
 */
async function cascadeTranslateString(text: string, from: 'ar' | 'fr' | 'en', to: 'ar' | 'fr' | 'en'): Promise<string> {
  if (!text || !text.trim() || from === to) return text;

  // 1. Google Translate (Handles paragraphs directly)
  try {
    if (text.length < 2500) {
      return await translateViaGoogle(text, from, to);
    } else {
      const paragraphs = text.split(/\n+/);
      const translatedList = await Promise.all(
        paragraphs.map(async (p) => {
          if (!p.trim()) return '';
          try {
            return await translateViaGoogle(p, from, to);
          } catch {
            return fallbackMedicalTranslate(p, from, to);
          }
        })
      );
      return translatedList.join('\n\n');
    }
  } catch (gErr) {
    console.warn('[TRANSLATE_GOOGLE_FALLBACK]', gErr);
  }

  // 2. MyMemory Backup
  try {
    return await translateViaMyMemory(text, from, to);
  } catch (mErr) {
    console.warn('[TRANSLATE_MYMEMORY_FALLBACK]', mErr);
  }

  // 3. Fallback Glossary
  return fallbackMedicalTranslate(text, from, to);
}

export async function POST(req: Request) {
  try {
    const body: TranslationRequest = await req.json();
    const { sourceLang, targetLangs, payload, domainContext = 'medical_article' } = body;

    if (!payload || Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'Empty translation payload' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // 1. If OpenAI API key is present, execute via LLM
    if (apiKey) {
      try {
        const systemPrompt = `You are a certified medical translator for the AVICINNA International Healthcare Platform in Turkey.
Translate the provided JSON object from "${sourceLang}" into the following target languages: ${targetLangs.join(', ')}.
Rules:
1. Maintain exact medical accuracy (e.g., JCI accreditation, oncology, robotic surgery, orthopedics).
2. Preserve all Markdown, HTML tags, line breaks, and formatting exactly as provided.
3. Return ONLY a valid JSON object keyed by target language code ("ar", "fr", "en"), where each value has the exact same keys as the input payload.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: JSON.stringify({ domainContext, payload }) },
            ],
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const translations = JSON.parse(data.choices[0].message.content);

          return NextResponse.json({
            success: true,
            translations: {
              ...translations,
              [sourceLang]: payload,
            },
          });
        }
      } catch (llmError) {
        console.warn('[TRANSLATION_API_FALLBACK] Falling back to neural cascade:', llmError);
      }
    }

    // 2. High-fidelity Neural Cascade Engine (Google Translate -> MyMemory -> Glossary)
    const translations: Record<string, Record<string, string>> = {
      [sourceLang]: payload,
    };

    for (const tLang of targetLangs) {
      const langResult: Record<string, string> = {};
      const keys = Object.keys(payload);

      // Translate all keys concurrently for this target language
      await Promise.all(
        keys.map(async (key) => {
          const rawValue = payload[key];
          langResult[key] = await cascadeTranslateString(rawValue, sourceLang, tLang);
        })
      );

      translations[tLang] = langResult;
    }

    return NextResponse.json({
      success: true,
      translations,
    });
  } catch (error) {
    console.error('[TRANSLATION_ENGINE_ERROR]:', error);
    return NextResponse.json({ error: 'Translation pipeline failed' }, { status: 500 });
  }
}

