import type { JobDescriptionPrompt } from './openai-client'

export function createJobDescriptionPrompt(data: JobDescriptionPrompt): string {
  if (data.enhancementType === 'generate') {
    return generatePrompt(data)
  } else {
    return enhancePrompt(data)
  }
}

function generatePrompt(data: JobDescriptionPrompt): string {
  return `Create a comprehensive job description for the following position:

Job Title: ${data.title}
Company: ${data.company}
Location: ${data.location}
Job Type: ${data.jobType}

Please include the following sections:
- Brief company/role overview (2-3 sentences)
- Key responsibilities (5-7 bullet points)
- Required qualifications (education, experience, skills)
- Preferred qualifications (nice-to-have skills/experience)
- Benefits and compensation overview
- Application instructions or next steps

Requirements:
- Make it professional, engaging, and tailored to attract qualified candidates
- Use clear formatting with headers and bullet points
- Keep the tone professional but approachable
- Focus on what makes this opportunity compelling
- Ensure the content is specific to the role and industry
- Keep total length between 400-800 words

Format the response in clean, readable text without excessive markdown or special formatting.`
}

function enhancePrompt(data: JobDescriptionPrompt): string {
  return `Enhance and improve the following job description:

Job Title: ${data.title}
Company: ${data.company}  
Location: ${data.location}
Job Type: ${data.jobType}

Current Description:
${data.existingDescription}

Please improve this description by:
- Making it more engaging and professional
- Adding any missing key sections (responsibilities, qualifications, benefits)
- Improving clarity and readability
- Ensuring it attracts qualified candidates
- Maintaining the original intent and key information
- Fixing any grammatical or structural issues

Requirements:
- Preserve the core message and requirements
- Enhance the professional tone
- Improve organization and flow
- Add compelling details where appropriate
- Ensure completeness (responsibilities, qualifications, benefits)
- Keep length between 400-800 words

Return the enhanced version with proper formatting and clear section headers.`
}