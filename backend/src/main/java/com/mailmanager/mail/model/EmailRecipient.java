package com.mailmanager.mail.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRecipient {
    private String name;
    private String email;

    public static EmailRecipient of(String email) {
        return EmailRecipient.builder().email(email).build();
    }

    public static EmailRecipient of(String name, String email) {
        return EmailRecipient.builder().name(name).email(email).build();
    }
}
