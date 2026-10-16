# EmailJS portfolio contact template

Use [`emailjs-contact.html`](./emailjs-contact.html) for the notification delivered to Prince when a visitor submits an enquiry. It matches the portfolio's blue accent and uses its existing `name`, `email`, and `message` fields.

The portfolio delivers messages through **EmailJS** using its server-side `POST /api/contact` endpoint. Configure the template below and provide the server environment variables to enable delivery.

## Dashboard setup

1. Connect your sending email account under **Email Services** in the [EmailJS dashboard](https://dashboard.emailjs.com/).
2. Under **Email Templates**, create a **Contact Us** template.
3. Open the content editor's HTML/code view and paste the contents of `emailjs-contact.html`.
4. Configure the fields below, save the template, and record its Template ID. If you customize the ID in Settings, use `template_portfolio_contact`.

| EmailJS field | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| Template name | Prince Malonzo - Portfolio enquiry                                     |
| Subject       | `New portfolio enquiry from {{name}}`                                  |
| To Email      | `malonzo.princebarachiel31@gmail.com`                                  |
| From Name     | `Prince Malonzo Portfolio`                                             |
| From Email    | Enable **Use Default Email Address** for your connected email service. |
| Reply-To      | `{{email}}`                                                            |
| Cc / Bcc      | Leave empty.                                                           |

The recipient is fixed in the template. The connected service supplies the From Email; Reply-To directs replies to the visitor. See [EmailJS's template setup guide](https://www.emailjs.com/docs/tutorial/creating-email-template/).

## Template variables

| Variable      | Source                                                                |
| ------------- | --------------------------------------------------------------------- |
| `{{name}}`    | Visitor's name from the contact form.                                 |
| `{{email}}`   | Visitor's email address from the contact form.                        |
| `{{message}}` | Message, including any project brief prepared by the project builder. |

Keep the double braces: [EmailJS escapes these values](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/) before inserting them into the HTML. The message block preserves line breaks. All three variables must be supplied by the sending code; they are not populated automatically when using the API.

Use [`emailjs-contact.sample.json`](./emailjs-contact.sample.json) as the template parameters for a preview or manual test. It contains example data only. A test send from the dashboard sends a real email to the configured recipient.

## Connect the portfolio

1. In **EmailJS Account > Security**, enable API requests for non-browser applications. The form sends from the Next.js server. See the [official server setup](https://github.com/emailjs-com/emailjs-nodejs).
2. Set these variables in the project's root `.env` or `.env.local`:

   ```dotenv
   EMAILJS_SERVICE_ID=service_your_id
   EMAILJS_TEMPLATE_ID=template_your_id
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_PRIVATE_KEY=your_private_key
   ```

   The private key is optional unless private-key authorization is enabled in your EmailJS account. Use the actual IDs from the dashboard, including the actual Template ID if you did not customize it. No new npm package is needed; the server uses the [EmailJS send API](https://www.emailjs.com/docs/rest-api/send/).

3. Restart the development server after editing the environment file. Keep only one local source for each value: `.env.local` takes precedence over `.env`.
4. For the deployed portfolio, set the same variables in **Vercel > Project Settings > Environment Variables**, select Production and any relevant Preview environments, then redeploy. Vercel does not receive your ignored local `.env` through Git. See [Vercel's environment-variable guide](https://vercel.com/docs/environment-variables).
5. Submit a message from the portfolio and check the inbox, spam folder, and Reply recipient.

The server passes only the three contact fields as `template_params`. Keep the fixed To Email in the dashboard template. All credentials use server-only environment names, without a `NEXT_PUBLIC_` prefix; never commit `.env` or a private key. Missing required configuration disables sending, and provider errors preserve the visitor's draft. Set `CONTACT_FORM_ENABLED=false` to pause the endpoint.
