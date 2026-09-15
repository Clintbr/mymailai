package com.mailmanager.common.exception;

public class MailProviderException extends RuntimeException {

    public MailProviderException(String message) {
        super(message);
    }

    public MailProviderException(String message, Throwable cause) {
        super(message, cause);
    }
}
