// supabase/functions/send-contact-notification/index.ts
// Deployed via: supabase functions deploy send-contact-notification
// Secret needed: supabase secrets set RESEND_API_KEY=re_xxxxxx

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  try {
    const body = await req.json()
    const { name, email, phone, message, product_id, inquiry_type } = body

    // ── Server-side validation ──────────────────────────────────────────────
    if (!name?.trim()) return json({ error: 'Name is required.' }, 400)
    if (!email?.trim()) return json({ error: 'Email address is required.' }, 400)
    if (!/\S+@\S+\.\S+/.test(email.trim())) return json({ error: 'Please enter a valid email address.' }, 400)

    const normalizedEmail  = email.trim().toLowerCase()
    const cleanName        = name.trim()
    const cleanPhone       = phone?.trim()   || null
    const cleanMessage     = message?.trim() || null
    const cleanInquiryType = inquiry_type    || 'general'

    // ── Supabase admin client (bypasses RLS) ────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    )

    // ── 24-hour duplicate check (case-insensitive email match) ──────────────
    // Logic: SELECT id FROM contact_submissions
    //        WHERE email ILIKE :normalizedEmail
    //          AND created_at > now() - interval '24 hours'
    //        LIMIT 1
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentSubs, error: checkError } = await supabase
      .from('contact_submissions')
      .select('id')
      .ilike('email', normalizedEmail)   // case-insensitive exact match (no wildcards)
      .gte('created_at', windowStart)
      .limit(1)

    if (checkError) {
      console.error('Duplicate check error:', JSON.stringify(checkError))
      // Non-fatal: continue, defaulting to not-duplicate to avoid blocking legitimate emails
    }

    const isDuplicate     = (recentSubs?.length ?? 0) > 0
    const notificationSent = !isDuplicate

    // ── Always insert the submission ────────────────────────────────────────
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name:              cleanName,
        email:             normalizedEmail,
        phone:             cleanPhone,
        message:           cleanMessage,
        product_id:        product_id || null,
        inquiry_type:      cleanInquiryType,
        notification_sent: notificationSent,
      })

    if (insertError) {
      console.error('Insert error:', JSON.stringify(insertError))
      return json({ error: 'Failed to save your message. Please try again.' }, 500)
    }

    // ── Send Resend email (only for first submission in 24h window) ─────────
    if (notificationSent) {
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

      if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured — skipping email notification.')
      } else {
        const inquiryLabel  = cleanInquiryType === 'product_enquiry' ? 'Product Enquiry' : 'General Contact'
        const phoneRow      = cleanPhone
          ? `<tr><td style="padding:10px 16px;color:#8B7355;font-size:0.85em;width:120px">Phone</td><td style="padding:10px 16px">${cleanPhone}</td></tr>`
          : ''
        const msgSection    = cleanMessage
          ? `<div style="background:#fff;padding:20px 24px;border:1px solid #E8DFD4;border-radius:8px;margin-top:20px">
               <p style="font-size:0.75em;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#B87333;margin:0 0 12px">Message</p>
               <p style="line-height:1.8;color:#2C2417;margin:0;white-space:pre-wrap">${cleanMessage}</p>
             </div>`
          : '<p style="color:#8B7355;font-style:italic;margin-top:20px">(No message provided)</p>'

        const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0EA;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 32px rgba(44,36,23,0.12)">

    <!-- Header -->
    <div style="background:#2C2417;padding:28px 32px;text-align:center">
      <p style="color:#D4A853;font-size:0.7em;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 4px">Friday Morning International</p>
      <h1 style="color:white;font-size:1.1em;margin:0;font-weight:400">New ${inquiryLabel}</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px">
      <h2 style="color:#7C5C2A;font-size:1em;margin:0 0 20px;border-bottom:2px solid #B87333;padding-bottom:12px">
        From: ${cleanName}
      </h2>

      <!-- Contact details table -->
      <table style="width:100%;border-collapse:collapse;background:#FAF7F2;border-radius:8px;overflow:hidden">
        <tr>
          <td style="padding:10px 16px;color:#8B7355;font-size:0.85em;width:120px">Name</td>
          <td style="padding:10px 16px;font-weight:600">${cleanName}</td>
        </tr>
        <tr style="background:#F0E9DF">
          <td style="padding:10px 16px;color:#8B7355;font-size:0.85em">Email</td>
          <td style="padding:10px 16px"><a href="mailto:${normalizedEmail}" style="color:#B87333;text-decoration:none">${normalizedEmail}</a></td>
        </tr>
        ${phoneRow}
        <tr style="background:#FAF7F2">
          <td style="padding:10px 16px;color:#8B7355;font-size:0.85em">Type</td>
          <td style="padding:10px 16px;font-size:0.85em">${inquiryLabel}</td>
        </tr>
      </table>

      ${msgSection}

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #E8DFD4">
        <p style="font-size:0.78em;color:#8B7355;margin:0;line-height:1.6">
          Reply directly to this email — it will reach <strong>${normalizedEmail}</strong>.<br>
          Submitted through the Friday Morning International website.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // NOTE: Change from address once fridaymorning.in is verified in Resend dashboard.
            // Free tier: must use onboarding@resend.dev. After verification: noreply@fridaymorning.in
            from:     'Friday Morning Website <onboarding@resend.dev>',
            to:       ['fridaymorningdev@gmail.com'],
            reply_to: normalizedEmail,
            subject:  `New ${inquiryLabel} — ${cleanName}`,
            html:     emailHtml,
          }),
        })

        if (!resendRes.ok) {
          const errText = await resendRes.text()
          console.error(`Resend API error ${resendRes.status}:`, errText)
          // Non-fatal: submission is saved; we just log the email failure
        } else {
          const resendData = await resendRes.json()
          console.log('Resend email sent. ID:', resendData?.id)
        }
      }
    } else {
      console.log(`Duplicate window — email suppressed for: ${normalizedEmail}`)
    }

    // ── Return success response ─────────────────────────────────────────────
    return json({
      success: true,
      isDuplicate,
      message: isDuplicate
        ? "Thanks — we've received your message. Since we already have a recent message from you, our team will review both together and be in touch soon."
        : "Message sent! We'll be in touch within one business day.",
    })

  } catch (err) {
    console.error('Edge function unhandled error:', err)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})
