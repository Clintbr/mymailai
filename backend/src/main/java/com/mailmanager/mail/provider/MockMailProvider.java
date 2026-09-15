package com.mailmanager.mail.provider;

import com.mailmanager.common.exception.ResourceNotFoundException;
import com.mailmanager.mail.model.Attachment;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailFolder;
import com.mailmanager.mail.model.EmailMessage;
import com.mailmanager.mail.model.EmailRecipient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Component("mockMailProvider")
public class MockMailProvider implements MailProvider {

    private final Map<String, Email> emailStore = new ConcurrentHashMap<>();

    public MockMailProvider() {
        initSeedEmails();
    }

    private void initSeedEmails() {
        Instant now = Instant.now();

        // 1. Job Offer / Interview
        Email jobOffer = Email.builder()
                .id("msg-001")
                .threadId("th-001")
                .sender(EmailRecipient.of("Sarah Jenkins (Tech Talent Lead)", "sarah.jenkins@innovatetech.io"))
                .recipients(List.of(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com")))
                .subject("Senior Full-Stack AI Engineer — Invitation to Technical Interview")
                .snippet("Hi Alex, We were thoroughly impressed by your portfolio and open-source AI email tools...")
                .body("""
                        Hi Alex,

                        Thank you for speaking with our leadership team last Tuesday. We were thoroughly impressed by your portfolio, particularly your hands-on architecture with Spring Boot, React, and Gemini AI.

                        We would love to invite you to our final round technical deep dive next week. We have slots available on Thursday at 2:00 PM CET or Friday at 10:00 AM CET via Google Meet.

                        Could you please confirm which slot suits you best, and let us know if you have any questions regarding the team or role before we meet?

                        Best regards,
                        Sarah Jenkins
                        Lead Technical Recruiter | InnovateTech
                        """)
                .timestamp(now.minus(45, ChronoUnit.MINUTES))
                .read(false)
                .starred(true)
                .labels(List.of("INBOX", "IMPORTANT", "CAREER"))
                .attachments(List.of(new Attachment("att-1", "Interview_Guide_2026.pdf", "application/pdf", 245000)))
                .folder(EmailFolder.INBOX)
                .build();

        // 2. Client Project Urgency
        Email clientUrgent = Email.builder()
                .id("msg-002")
                .threadId("th-002")
                .sender(EmailRecipient.of("Marcus Vance", "marcus@vancemedia.com"))
                .recipients(List.of(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com")))
                .subject("URGENT: API Rate Limit reached on Production Checkout")
                .snippet("Alex, our checkout webhook is currently receiving 429 errors from the payment provider...")
                .body("""
                        Alex,

                        Our checkout webhook is currently throwing 429 Too Many Requests errors from the primary payment gateway since 14:15 UTC.

                        We noticed a surge in traffic from the newly launched marketing campaign. Can you immediately review the request throttling and connection pooling in our backend service?

                        Please let me know once you've looked into this so we can update the stakeholder dashboard.

                        Marcus Vance
                        CTO, Vance Media
                        """)
                .timestamp(now.minus(2, ChronoUnit.HOURS))
                .read(false)
                .starred(true)
                .labels(List.of("INBOX", "URGENT", "WORK"))
                .folder(EmailFolder.INBOX)
                .build();

        // 3. Team Collaboration / Meeting Request
        Email teamMeeting = Email.builder()
                .id("msg-003")
                .threadId("th-003")
                .sender(EmailRecipient.of("Elena Rostova", "elena.rostova@cloudscale.org"))
                .recipients(List.of(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com")))
                .subject("Architecture Review: Q3 Microservices & AI Roadmap")
                .snippet("Hey Alex, hope your week is going well. I've drafted the architectural blueprint...")
                .body("""
                        Hey Alex,

                        Hope your week is going well!

                        I have drafted the preliminary architectural blueprint for our Q3 AI-powered mail summarization features. Before we present it to the VP of Engineering, I'd appreciate 20 minutes of your time to review the data flow and latency expectations.

                        Are you free tomorrow around 3:30 PM for a quick sync?

                        Cheers,
                        Elena
                        """)
                .timestamp(now.minus(6, ChronoUnit.HOURS))
                .read(true)
                .starred(false)
                .labels(List.of("INBOX", "WORK"))
                .folder(EmailFolder.INBOX)
                .build();

        // 4. Finance / Invoice
        Email invoice = Email.builder()
                .id("msg-004")
                .threadId("th-004")
                .sender(EmailRecipient.of("Billing Dept @ AWS", "no-reply-billing@amazon.com"))
                .recipients(List.of(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com")))
                .subject("Your AWS Billing Invoice for August 2026 is ready")
                .snippet("Greetings from Amazon Web Services. Your monthly billing statement #INV-98214 is now available...")
                .body("""
                        Dear Alex Mercer,

                        Your Amazon Web Services invoice for the billing period August 1 – August 31, 2026 is now available.

                        Total Amount Due: $42.18 USD
                        Payment Method: Visa ending in 4092 (Automatic charge scheduled for Sep 18, 2026)

                        You can view detailed itemized usage reports in the AWS Billing and Cost Management Console.

                        Thank you for using Amazon Web Services.
                        """)
                .timestamp(now.minus(1, ChronoUnit.DAYS))
                .read(true)
                .starred(false)
                .labels(List.of("INBOX", "FINANCE"))
                .attachments(List.of(new Attachment("att-2", "AWS_Invoice_Aug2026.pdf", "application/pdf", 112000)))
                .folder(EmailFolder.INBOX)
                .build();

        // 5. Tech Newsletter
        Email newsletter = Email.builder()
                .id("msg-005")
                .threadId("th-005")
                .sender(EmailRecipient.of("TLDR Web Dev", "dan@tldrnewsletter.com"))
                .recipients(List.of(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com")))
                .subject("TLDR Web Dev: Gemini 2.5 Flash released, Spring Boot 3.4 performance benchmarks")
                .snippet("Google releases Gemini 2.5 with ultra-fast latency, React 19 compiler updates, and Spring AI...")
                .body("""
                        TLDR Web Dev — Daily Digest for Developers

                        🤖 BIG AI NEWS:
                        Google announced Gemini 2.5 Flash with sub-200ms structured JSON inference, making real-time assistant agents significantly faster.

                        ☕ JAVA & SPRING:
                        Spring Boot 3.4 brings enhanced virtual thread ergonomics and native Spring AI integrations for seamless GenAI applications.

                        ⚛️ REACT CORNER:
                        How TanStack Query v5 simplifies optimistic updates and offline-first architectures.

                        Enjoyed today's issue? Share with a colleague!
                        """)
                .timestamp(now.minus(2, ChronoUnit.DAYS))
                .read(true)
                .starred(false)
                .labels(List.of("INBOX", "NEWSLETTER"))
                .folder(EmailFolder.INBOX)
                .build();

        // 6. Personal Friend Email
        Email personal = Email.builder()
                .id("msg-006")
                .threadId("th-006")
                .sender(EmailRecipient.of("David Chen", "david.chen.personal@gmail.com"))
                .recipients(List.of(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com")))
                .subject("Weekend Bouldering & Coffee?")
                .snippet("Hey man! Are we still on for climbing this Saturday morning? Let me know if 9 AM works...")
                .body("""
                        Hey Alex!

                        Are we still good for climbing at the new bouldering gym this Saturday morning?

                        I'm thinking 9:30 AM so we beat the crowd, followed by that specialty espresso place down the street. Let me know if you can make it!

                        David
                        """)
                .timestamp(now.minus(3, ChronoUnit.DAYS))
                .read(false)
                .starred(false)
                .labels(List.of("INBOX", "PERSONAL"))
                .folder(EmailFolder.INBOX)
                .build();

        emailStore.put(jobOffer.getId(), jobOffer);
        emailStore.put(clientUrgent.getId(), clientUrgent);
        emailStore.put(teamMeeting.getId(), teamMeeting);
        emailStore.put(invoice.getId(), invoice);
        emailStore.put(newsletter.getId(), newsletter);
        emailStore.put(personal.getId(), personal);

        log.info("Initialized MockMailProvider with {} realistic seed emails", emailStore.size());
    }

    @Override
    public List<Email> getEmails() {
        return emailStore.values().stream()
                .filter(e -> e.getFolder() != EmailFolder.TRASH && e.getFolder() != EmailFolder.ARCHIVE)
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Email> getEmails(String query, int maxResults) {
        return emailStore.values().stream()
                .filter(e -> {
                    if (e.getFolder() == EmailFolder.TRASH) return false;
                    if (query == null || query.trim().isEmpty()) return true;
                    String q = query.toLowerCase();
                    boolean matchSubject = e.getSubject() != null && e.getSubject().toLowerCase().contains(q);
                    boolean matchBody = e.getBody() != null && e.getBody().toLowerCase().contains(q);
                    boolean matchSender = e.getSender() != null &&
                            (e.getSender().getEmail().toLowerCase().contains(q) ||
                             (e.getSender().getName() != null && e.getSender().getName().toLowerCase().contains(q)));
                    return matchSubject || matchBody || matchSender;
                })
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(maxResults > 0 ? maxResults : 50)
                .collect(Collectors.toList());
    }

    @Override
    public Email getEmail(String id) {
        Email email = emailStore.get(id);
        if (email == null) {
            throw new ResourceNotFoundException("Email", "id", id);
        }
        return email;
    }

    @Override
    public void sendEmail(EmailMessage message) {
        log.info("MockMailProvider: Simulating sending email to: {}, Subject: {}",
                message.getTo().stream().map(EmailRecipient::getEmail).collect(Collectors.joining(", ")),
                message.getSubject());

        // Create a sent copy in memory
        String id = "sent-" + UUID.randomUUID().toString().substring(0, 8);
        Email sentEmail = Email.builder()
                .id(id)
                .threadId(message.getThreadId() != null ? message.getThreadId() : "th-" + id)
                .sender(EmailRecipient.of("Alex Mercer", "alex.mercer@gmail.com"))
                .recipients(new ArrayList<>(message.getTo()))
                .cc(new ArrayList<>(message.getCc()))
                .bcc(new ArrayList<>(message.getBcc()))
                .subject(message.getSubject())
                .body(message.getBody())
                .snippet(message.getBody().length() > 100 ? message.getBody().substring(0, 100) + "..." : message.getBody())
                .timestamp(Instant.now())
                .read(true)
                .starred(false)
                .labels(List.of("SENT"))
                .folder(EmailFolder.SENT)
                .build();

        emailStore.put(id, sentEmail);
    }

    @Override
    public void markAsRead(String id) {
        Email email = getEmail(id);
        email.setRead(true);
        log.info("MockMailProvider: Marked email {} as read", id);
    }

    @Override
    public void markAsUnread(String id) {
        Email email = getEmail(id);
        email.setRead(false);
        log.info("MockMailProvider: Marked email {} as unread", id);
    }

    @Override
    public void archive(String id) {
        Email email = getEmail(id);
        email.setFolder(EmailFolder.ARCHIVE);
        log.info("MockMailProvider: Archived email {}", id);
    }

    @Override
    public String getProviderName() {
        return "MOCK (Development & Demo)";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}
