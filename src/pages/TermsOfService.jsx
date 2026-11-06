import React from 'react';
import SEO from '../components/common/SEO';

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service | Sri Villiam Sai"
        description="Terms of Service for Sri Villiam Sai's developer portfolio."
        canonical="/terms-of-service"
      />

      <section aria-labelledby="article-title" className="bg-background py-16 md:py-24 border-b">
        <div className="mx-auto max-w-3xl px-6">
          <article className="flex flex-col gap-12 md:gap-16">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 md:gap-5">
                <h1 className="heading-xl" id="article-title">
                  Terms of Service
                </h1>
                <p className="text-muted-foreground text-lg">Last updated: March 23, 2026</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="leading-7 text-muted-foreground">
                Welcome to my portfolio website. By accessing or using this website, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms,
                you are prohibited from using or accessing this site.
              </p>
              <h2 className="pb-2 pt-10 text-3xl font-semibold font-mono" id="use-license">
                1. Use License
              </h2>
              <p className="leading-7 text-muted-foreground">
                Permission is granted to temporarily download one copy of the materials (information or software) on Sri
                Villiam Sai's website for personal, non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may not:
              </p>
              <ul aria-label="License restrictions" className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>Modify or copy the materials;</li>
                <li>
                  Use the materials for any commercial purpose, or for any public display (commercial or
                  non-commercial);
                </li>
                <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              <p className="leading-7 text-muted-foreground mt-4">
                This license shall automatically terminate if you violate any of these restrictions and may be
                terminated by Sri Villiam Sai at any time.
              </p>
              <h2 className="pb-2 pt-10 text-3xl font-semibold font-mono" id="disclaimer">
                2. Disclaimer
              </h2>
              <p className="leading-7 text-muted-foreground">
                The materials on this website are provided on an 'as is' basis. Sri Villiam Sai makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
              <h2 className="pb-2 pt-10 text-3xl font-semibold font-mono" id="limitations">
                3. Limitations
              </h2>
              <p className="leading-7 text-muted-foreground">
                In no event shall Sri Villiam Sai or his suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out of the use
                or inability to use the materials on this website, even if Sri Villiam Sai or an authorized
                representative has been notified orally or in writing of the possibility of such damage.
              </p>
              <h2 className="pb-2 pt-10 text-3xl font-semibold font-mono" id="accuracy">
                4. Accuracy of Materials
              </h2>
              <p className="leading-7 text-muted-foreground">
                The materials appearing on the website could include technical, typographical, or photographic errors.
                Sri Villiam Sai does not warrant that any of the materials on its website are accurate, complete, or
                current. Sri Villiam Sai may make changes to the materials contained on its website at any time without
                notice.
              </p>
              <h2 className="pb-2 pt-10 text-3xl font-semibold font-mono" id="links">
                5. Links
              </h2>
              <p className="leading-7 text-muted-foreground">
                Sri Villiam Sai has not reviewed all of the sites linked to its website and is not responsible for the
                contents of any such linked site. The inclusion of any link does not imply endorsement by Sri Villiam
                Sai of the site. Use of any such linked website is at the user's own risk.
              </p>
              <h2 className="pb-2 pt-10 text-3xl font-semibold font-mono" id="modifications">
                6. Modifications
              </h2>
              <p className="leading-7 text-muted-foreground">
                Sri Villiam Sai may revise these terms of service for its website at any time without notice. By using
                this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
              <p className="pt-10 leading-7 text-muted-foreground">
                If you have any questions about these Terms, please contact me at:
                <br />
                <br />
                Email:{' '}
                <a className="text-primary" href="mailto:srivilliamsai@gmail.com">
                  srivilliamsai@gmail.com
                </a>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
