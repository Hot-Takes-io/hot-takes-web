import React from "react";
import {
  Container,
  Title,
  Text,
  ScrollAreaAutosize,
  Anchor,
} from "@mantine/core";

const PrivacyPolicy = () => {
  return (
    <Container>
      <Title order={1}>Privacy Policy</Title>
      <ScrollAreaAutosize mah="calc(100vh - 150px)" pt="sm" offsetScrollbars>
        <Text>
          <strong>Introduction</strong>
          <br />
          Hot-Takes.io (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you
          visit our website [Hot-Takes.io] (the &quot;Platform&quot;). Please
          read this privacy policy carefully. If you do not agree with the terms
          of this privacy policy, please do not access the Platform.
        </Text>
        <Title order={2}>Information We Collect</Title>
        <Text>
          <strong>Personal Information</strong>
          <br />
          When you create an account or use our Platform, we may collect
          personal information that can be used to identify you, such as:
        </Text>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Username</li>
          <li>Profile picture</li>
        </ul>
        <Text>
          <strong>Non-Personal Information</strong>
          <br />
          We may also collect non-personal information that does not identify
          you, such as:
        </Text>
        <ul>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>IP address</li>
          <li>Usage data (e.g., pages viewed, time spent on pages)</li>
        </ul>
        <Text>
          <strong>Cookies and Tracking Technologies</strong>
          <br />
          We use cookies and similar tracking technologies to track activity on
          our Platform and hold certain information. Cookies are files with a
          small amount of data which may include an anonymous unique identifier.
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our Platform.
        </Text>
        <Title order={2}>How We Use Your Information</Title>
        <Text>We use the information we collect in the following ways:</Text>
        <ul>
          <li>To provide, operate, and maintain the Platform</li>
          <li>To improve, personalize, and expand the Platform</li>
          <li>To understand and analyze how you use the Platform</li>
          <li>
            To develop new products, services, features, and functionality
          </li>
          <li>
            To communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the Platform, and for
            marketing and promotional purposes
          </li>
          <li>To process your transactions and manage your orders</li>
          <li>To find and prevent fraud</li>
          <li>To comply with legal obligations</li>
        </ul>
        <Title order={2}>How We Share Your Information</Title>
        <Text>
          We may share your information in the following situations:
          <strong>With Service Providers</strong>: We may share your information
          with third-party service providers to perform tasks on our behalf and
          to assist us in providing the Platform.
          <br />
          <strong>Business Transfers</strong>: If we are involved in a merger,
          acquisition, or asset sale, your information may be transferred.
          <br />
          <strong>Law Enforcement</strong>: We may disclose your information to
          law enforcement officials or other government authorities in response
          to a legal request.
          <br />
          <strong>With Your Consent</strong>: We may disclose your personal
          information for any other purpose with your consent.
        </Text>
        <Title order={2}>Data Security</Title>
        <Text>
          We implement reasonable measures to protect your information from
          unauthorized access, use, or disclosure. However, please be aware that
          no method of transmission over the internet or method of electronic
          storage is 100% secure and we cannot guarantee absolute security.
        </Text>
        <Title order={2}>Your Data Protection Rights</Title>
        <Text>
          Depending on your location, you may have the following rights
          regarding your personal information:
        </Text>
        <ul>
          <li>
            The right to access – You have the right to request copies of your
            personal data.
          </li>
          <li>
            The right to rectification – You have the right to request that we
            correct any information you believe is inaccurate or complete
            information you believe is incomplete.
          </li>
          <li>
            The right to erasure – You have the right to request that we erase
            your personal data, under certain conditions.
          </li>
          <li>
            The right to restrict processing – You have the right to request
            that we restrict the processing of your personal data, under certain
            conditions.
          </li>
          <li>
            The right to object to processing – You have the right to object to
            our processing of your personal data, under certain conditions.
          </li>
          <li>
            The right to data portability – You have the right to request that
            we transfer the data that we have collected to another organization,
            or directly to you, under certain conditions.
          </li>
        </ul>
        If you make a request, we have one month to respond to you. If you would
        like to exercise any of these rights, please contact us via{" "}
        <Anchor href="mailto:support@hot-takes.io">email</Anchor>.
        <Title order={2}>Changes to This Privacy Policy</Title>
        <Text>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
          Changes to this Privacy Policy are effective when they are posted on
          this page.
        </Text>
        <Title order={2}>Contact Us</Title>
        <Text>
          If you have any questions about this Privacy Policy, please contact us
          via <Anchor href="mailto:support@hot-takes.io">email</Anchor>.
        </Text>
        <Text>
          By using Hot-Takes.io, you acknowledge that you have read, understood,
          and agree to be bound by this Privacy Policy.
        </Text>
      </ScrollAreaAutosize>
    </Container>
  );
};

export default PrivacyPolicy;
