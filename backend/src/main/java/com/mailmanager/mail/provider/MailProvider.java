package com.mailmanager.mail.provider;

import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailMessage;

import java.util.List;

public interface MailProvider {

    List<Email> getEmails();

    List<Email> getEmails(String query, int maxResults);

    Email getEmail(String id);

    void sendEmail(EmailMessage message);

    void markAsRead(String id);

    void markAsUnread(String id);

    void archive(String id);

    String getProviderName();

    boolean isAvailable();
}
