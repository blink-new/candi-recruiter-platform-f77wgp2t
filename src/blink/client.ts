import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'candi-recruiter-platform-f77wgp2t',
  authRequired: true
})

export { blink }
export default blink