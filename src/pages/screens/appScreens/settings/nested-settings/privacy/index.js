import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components'
import { Text } from 'react-native';

const Container = styled.ScrollView`
    width: 100%;
    flex: 1;
    padding-left: 15px;
    padding-right: 15px;
`;

const Title = styled.Text`
    font-size: 24px;
    margin-bottom: 10px;
    font-weight: 600;
`;

const TextTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 7px;
    font-weight: 600;
`;

const TitleBody = styled.Text`
    font-size: 14px;
    margin-bottom: 12px;
`;

const Bold = styled.Text`
    font-weight: 500;
`;

const PagePrivacy = () => {

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30   }}  edges={['top', 'left', 'right']}>
            <Container>
                <Title>Privacy and Security</Title>
                <Text style={{marginBottom: 20}}>Last Updated: Friday February 17, 2023</Text>
                <TextTitle>Introduction</TextTitle>
                <TitleBody>Greenclick ("we", "us", or "our") is committed to protecting the privacy of our users ("you" or "your") and providing a safe and secure user experience. This Privacy Policy outlines the information we collect from you, how we use it, and the measures we take to ensure your privacy.</TitleBody>
                <TextTitle>Information We Collect</TextTitle>
                <TitleBody>We collect certain personal information from you when you use our application, Greenclick, to purchase and manage car rentals. The types of personal information we collect include:
                </TitleBody>
                <TitleBody><Bold>Phone Number:</Bold> We collect your phone number to verify your account and send text verification messages to your cell phone through Twilio.</TitleBody>

                <TitleBody><Bold>Email Address:</Bold> We collect your email address to verify your account and send purchase information and receipts to your email address through SendGrid.</TitleBody>
                <TitleBody><Bold>Full Name:</Bold> We collect your full name for personalization throughout the application, on Stripe receipts, and in emails.</TitleBody>

                <TitleBody><Bold>Date of Birth:</Bold> We collect your date of birth to verify that you are 18 years of age or older.</TitleBody>

                <TitleBody><Bold>Address:</Bold> We collect your address for Stripe billing and mailing purposes in case any issues arise with your car rental, such as theft. We collect this information during the sign-up process on our application.</TitleBody>

                <TitleBody><Bold>Stripe</Bold> collects your card information and billing address. This information is saved on Stripe's secure servers and is not stored on our servers.</TitleBody>

                <TextTitle>Use of Information</TextTitle>
                <TitleBody>We use the personal information we collect from you to provide our car rental services, to contact you in case of any legal issues, such as theft or failure to return the rental, and to process payments. We do not share your information with any third parties except for Stripe and SendGrid as described below.</TitleBody>

                <TextTitle>Sharing Information</TextTitle>
                <TitleBody>We may share your personal information with third-party service providers to help us provide our services, such as processing payments through Stripe and sending email notifications through SendGrid. We may also share your information if required by law, regulation, or court order.</TitleBody>

                <TextTitle>Security & Storage</TextTitle>
                <TitleBody>We take appropriate measures to protect the security of your personal information, including implementing appropriate technical and organizational measures to prevent unauthorized access, disclosure, or destruction. We store your personal information on secure servers provided by Mongo Database, and we transmit your information using end-to-end encryption.</TitleBody>

                <TextTitle>Your Rights</TextTitle>
                <TitleBody>You have the right to access, update, or delete your personal information. You may also opt-out of receiving email notifications from us at any time. To exercise these rights or for any questions or concerns regarding our Privacy Policy, please contact us at support@greenclick.com.</TitleBody>

                <TextTitle>Changes to this Privacy Policy</TextTitle>
                <TitleBody>We reserve the right to update or modify this Privacy Policy at any time. If we make any material changes, we will notify you by posting the updated Privacy Policy on our website or by sending you an email. Your continued use of our application after any such changes constitutes your acceptance of the revised Privacy Policy.</TitleBody>
                
                <TextTitle>Contact Us</TextTitle>
                <TitleBody>If you have any questions or concerns about our Privacy Policy or our privacy practices, please contact us at support@greenclick.com.</TitleBody>
            </Container>
        </SafeAreaView>
    )
}

export default PagePrivacy