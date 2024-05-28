import React from "react";
import { Container, Title, Text, ScrollAreaAutosize } from "@mantine/core";

const TermsOfService = () => {
  return (
    <Container>
      <Title order={1}>Terms of Service</Title>
      <ScrollAreaAutosize mah="calc(100vh - 150px)" pt="sm" offsetScrollbars>
        <Text>
          <strong>Introduction</strong>
          <br />
          Welcome to Hot-Takes.io! By accessing or using our platform, you agree
          to comply with and be bound by these Terms of Service. Please read
          them carefully. If you do not agree with any part of these terms, you
          must not use our platform.
        </Text>

        <Text>
          <strong>Use of the Platform</strong>
          <br />
          <strong>Eligibility</strong>
          <br />
          You must be at least 13 years old to use Hot-Takes.io. By using the
          platform, you represent and warrant that you meet this age
          requirement.
          <br />
          <strong>Account Registration</strong>
          <br />
          To access certain features, you may need to create an account. You are
          responsible for maintaining the confidentiality of your account
          information and for all activities that occur under your account. You
          agree to notify us immediately of any unauthorized use of your
          account.
          <br />
          <strong>User Content</strong>
          <br />
          Hot-Takes.io allows users to post, share, and view opinions
          (&quot;takes&quot;). You retain all rights to the content you post. By
          posting content, you grant Hot-Takes.io a non-exclusive, worldwide,
          royalty-free license to use, display, and distribute your content on
          the platform.
          <br />
          <strong>Prohibited Conduct</strong>
          <br />
          You agree not to:
        </Text>
        <ul>
          <li>
            Post content that is illegal, harmful, threatening, abusive,
            harassing, defamatory, vulgar, obscene, or otherwise objectionable.
          </li>
          <li>
            Impersonate any person or entity or falsely state or misrepresent
            your affiliation with a person or entity.
          </li>
          <li>
            Engage in any activity that interferes with or disrupts the platform
            or its servers.
          </li>
          <li>Use the platform for any illegal or unauthorized purpose.</li>
        </ul>

        <Text>
          <strong>Voting and Badges</strong>
          <br />
          Users can vote on takes, which may earn the following badges:
        </Text>
        <ul>
          <li>
            <strong>HOT TAKE</strong>: This take is on fire 🔥 and shows
            expertise.
          </li>
          <li>
            <strong>HOT SHIT</strong>: This take stinks 💩 and is questionable.
          </li>
          <li>
            <strong>¯\_(ツ)_/¯</strong>: This take is indifferent 🤷‍♂️ and might
            need time to gain traction.
          </li>
        </ul>

        {/* Add more sections as needed */}

        <Text>
          By using Hot-Takes.io, you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Service.
        </Text>
      </ScrollAreaAutosize>
    </Container>
  );
};

export default TermsOfService;
