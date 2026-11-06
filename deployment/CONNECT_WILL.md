# Connect WILL to Gemini on AWS

The upload file [will-assistant-stack.json](will-assistant-stack.json) contains the backend code and connection settings. It contains no API key. Your current Gemini key goes into **CloudFormation → Parameters → GeminiApiKey**, never into a `VITE_*` variable.

This setup creates AWS Lambda functions, a Secrets Manager secret, IAM execution roles and seven-day CloudWatch log groups. AWS resources and Gemini requests can incur charges. It updates the existing Amplify app's API rewrite; it does not deploy the frontend or change its environment variables.

## Console steps

1. Sign into the AWS account containing your portfolio. Open [CloudFormation in Mumbai](https://ap-south-1.console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/create/template). The region must be **Asia Pacific (Mumbai), ap-south-1**, matching your Amplify app.
2. Choose **Create stack → With new resources (standard)** if the create form is not already open. Under **Specify template**, select **Upload a template file → Choose file**. Upload `deployment/will-assistant-stack.json` from this repository. Click **Next**.
3. Set **Stack name** to `will-assistant`. Under **Parameters**, paste your existing Gemini API key into **GeminiApiKey**, without quotes or spaces. Leave these defaults:

   | Parameter | Value |
   |---|---|
   | AmplifyAppId | `d229cwpntq8yz1` |
   | FrontendOrigin | `https://main.d229cwpntq8yz1.amplifyapp.com` |
   | TextModel | `gemini-3.1-flash-lite` |
   | TtsModel | `gemini-3.1-flash-tts-preview` |
   | LiveModel | `gemini-3.8-live` |
   | VoiceName | `Algieba` |

   Use your real domain for `FrontendOrigin` if visitors use a custom domain. The key field is masked (`NoEcho`); the key is stored in Secrets Manager and is not included in stack outputs or frontend files.

4. Click **Next**. On **Configure stack options**, keep the normal options and acknowledge that CloudFormation may create IAM resources. Click **Next**, review the stack, then click **Submit**. The acknowledgement permits the stack's execution roles; it does not require you to create an AWS access key.
5. Wait until the stack shows **CREATE_COMPLETE**. Open **Outputs → StatusUrl**. It should return JSON including `"provider":"gemini"`, `"chat":true`, `"voice":true` and `"tts":true`. The stack adds `/api/assistant/<*>` before the existing SPA rule and preserves your other redirects. Rewrite propagation can take a few minutes.
6. In **Amplify → Hosting → Environment variables**, keep the public URLs you already entered. Leave `VITE_ASSISTANT_API_URL` empty or absent. Save, then deploy the latest reviewed frontend changes to the connected `main` branch. The current `customHttp.yml` enables the microphone, Spotify player and Gemini Live WebSocket. Adding the backend alone does not replace an older frontend deployment.
7. Open the deployed HTTPS portfolio. Try a normal project question, spoken reply, and Live microphone session. Status JSON confirms the backend is configured; only real chat, TTS and Live requests confirm your key's model access and quota. Test interruption and microphone permission on your own device.

## If something fails

- **GeminiApiKey must match pattern:** `AQ.` key formats include a dot. An earlier version of this template rejected dots; upload the current template, which accepts them, rather than removing characters from your key. Copy only the key, with no quotes, spaces or `GEMINI_API_KEY=` prefix. If a real key was shared in chat, replace it in Google AI Studio and enter the replacement privately in AWS.
- **CREATE_FAILED / ROLLBACK_COMPLETE:** open the stack's **Events** tab and inspect the first failure. Common causes are the wrong AWS account/region/app ID or missing permission to create the listed resources. Do not share your key in screenshots. If an assistant rewrite already points to a different backend, this stack refuses to replace it automatically.
- **StatusUrl shows HTML:** open **Outputs → BackendStatusUrl**. If the direct backend works, check **Amplify → Hosting → Rewrites and redirects** for the assistant rule at the top, then allow time for propagation. When editing the SPA fallback later, preserve this first API rule.
- **StatusUrl says Gemini, but answers fall back or voice fails:** inspect the assistant Lambda's CloudWatch logs and your Google API project for model access, quota or billing errors. The backend logs only a generic failure status, not your key or questions. Model parameters can be changed with **Update stack → Use existing template**.
- **Microphone/Spotify blocked:** deploy the latest frontend and confirm its actual response headers contain `microphone=(self)` and the current CSP. A backend stack cannot replace frontend security headers.

The API is public for portfolio visitors. Browser origin checks and per-instance request limits are included; they are not authentication or a global spending cap. Set suitable Google project quotas and monitor usage before wider public use. AWS billing alerts notify; they do not stop requests.

## Updating or removing the connection

After backend or portfolio knowledge changes, run `npm run assistant:package`, then **Update stack → Replace existing template → Upload a template file** and upload the regenerated JSON. Frontend Git pushes do not update this separate Lambda deployment. Keep the same Amplify app ID for an existing stack.

Rotate the Gemini key in **Secrets Manager → the stack's GeminiSecret → Retrieve secret value → Edit**. The backend refreshes the secret after at most five minutes. Also supply the new key on the next stack update so an older parameter cannot restore a revoked key.

To remove the backend, delete the `will-assistant` stack. It removes its own assistant rewrite and resources while preserving the Amplify app and other routes. CloudFormation deletes this stored copy of the secret without a recovery window; it does not revoke your Google API key. The frontend retains its local answer fallback. The console's uploaded template may remain in its CloudFormation S3 bucket.

Local deployment tests cover the compressed Lambda entrypoint, SSE delivery before completion, WAV bytes, secret caching/rotation, origin/body/request limits, disconnects and safe rewrite changes. Actual CloudFormation provisioning, Amplify streaming behavior and paid Gemini calls still require an authenticated AWS deployment and real key.

## References

- [CloudFormation console stack creation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html)
- [Lambda function URLs and streaming](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-lambda-url.html)
- [Function URL access permissions](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)
- [Amplify reverse-proxy rewrites](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)
- [Vite public environment variables](https://vite.dev/guide/env-and-mode)
