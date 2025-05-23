package com.backend.ecommerce.service;

import com.backend.ecommerce.model.Order;
import com.backend.ecommerce.model.OrderItem;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.OrderRepository;
import com.backend.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityNotFoundException;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailService {


    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private OrderRepository orderRepository;
    @Value("${app.url}")
    private String appUrl;

    public void sendVerificationEmail(String email, String verificationToken) throws MessagingException {
        String subject = "User Confirmation";
        String verificationLink = appUrl + "/auth/verify?token=" + verificationToken;
        String body = "Please click on this link to verify your email address: " + verificationLink;

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText("<html>\n" +
                "<head>\n" +
                "	<title> Welcome </title>\n" +
                "</head>\n" +
                "<body style=\"font-family: Arial, sans-serif;\">\n" +
                "	<table style=\"border: 1px solid #ccc; padding: 10px;\">\n" +
                "		<tr>\n" +
                "			<td>\n" +
                "				<h1 style=\"color: #333;\">Thank you for registering with our service!</h1>\n" + "<p><img src=\"https://cdn.templates.unlayer.com/assets/1636450033923-19197947.png\" alt=\"product image\" width=\"400\" height=\"400\"></p>" +
                "<h3 style=\"color: #333;\">We're excited to have you get started! First, you need to confirm your account. Just click the button below.</h3>\n" +
                "				<div style=\"background-color: #0096FF; padding: 10px; display: inline-block; margin: 10px 0;\">\n" +
                "					<a href=\"" + verificationLink + "\" style=\"color: white; text-decoration: none;\">Click here to confirm your email address</a>\n" +
                "				</div>\n" +
                "<h3 style=\"color: #333;\">If you have any questions, please feel free to let us know - we're always ready to help out.</h3>\n" +
                "\n" +
                "<h3 style=\"color: #333;\">Cheers,</h3>\n" +
                "<h3 style=\"color: #333;\">Hihihihi</h3>\n" +
                "			</td>\n" +
                "		</tr>\n" +
                "	</table>\n" +
                "</body>\n" +
                "</html>", true);

        javaMailSender.send(message);
    }

    //resetPasswordEmail
    public void sendResetPasswordEmail(String email, String token) throws MessagingException {
        String resetLink = "http://localhost:5173" + "/reset-password?token=" + token;
        String subject = "Reset Your Password";

        String htmlContent = "<html><body style=\"font-family: Arial, sans-serif;\">" +
                "<h2>Password Reset Request</h2>" +
                "<p>We received a request to reset your password. Click the button below to reset it:</p>" +
                "<a href=\"" + resetLink + "\" style=\"display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">Reset Password</a>" +
                "<p>If you didn’t request this, you can ignore this email.</p>" +
                "<p>Thanks,<br>Hihihihi Support Team</p>" +
                "</body></html>";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        javaMailSender.send(message);
    }
    //resetPasswordEmail

    //SendingOTP
    public void sendLoginOtpEmail(String to, String otp) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Your Login OTP Code");
        helper.setText(
                "<div style='font-family: Arial, sans-serif;'>" +
                        "<h3>🛡️ Your Login OTP</h3>" +
                        "<p>Your One-Time Password (OTP) is:</p>" +
                        "<h2 style='color: #2e6da4;'>" + otp + "</h2>" +
                        "<p>This OTP is valid for 5 minutes. If you did not request it, please ignore this email.</p>" +
                        "<br><p>Thank you,<br>GachaWorld Team</p>" +
                        "</div>",
                true // HTML enabled
        );

        javaMailSender.send(message);
    }
    //SendingOTP

    public MimeMessage createConfirmationMessage(Long order_id, String email) throws MessagingException {
        Optional<Order> existingOrder = orderRepository.findById(order_id);
        if (!existingOrder.isPresent()) {
            throw new EntityNotFoundException("Order not found with ID: " + order_id);
        }
        String customerName = existingOrder.get().getUser().getFirstname() + ' '+ existingOrder.get().getUser().getLastname();
        String phoneNumber = existingOrder.get().getUser().getPhoneNumber() == null ? "" : " have phone number: " + existingOrder.get().getUser().getPhoneNumber();
        String contactEmail = "support@hihi.com";
        String companyName = "Hihihi";
        String orderDetails = getOrderDetails(order_id);

        String htmlMessage = "<html><body>"
                + "<div style=\"font-family: Arial, sans-serif; font-size: 14px;\">"
                + "<p>Dear " + customerName + phoneNumber + " ,</p>"
                + "<p>Thank you for placing your order with us. We appreciate your business.</p>"
                + "<p>We are pleased to inform you that your order has been received and is being processed. Please see the details below:</p>"
                + "<table style=\"border-collapse: collapse; width: 100%;\">"
                + "<thead>"
                + "<tr style=\"background-color: #ccc;\">"
                + "<th style=\"padding: 10px; text-align: left;\">Product Name</th>"
                + "<th style=\"padding: 10px; text-align: left;\">Price per Unit</th>"
                + "<th style=\"padding: 10px; text-align: left;\">Quantity</th>"
                + "<th style=\"padding: 10px; text-align: left;\">Total Price</th>"
                + "</tr>"
                + "</thead>"
                + "<tbody>"
                + orderDetails
                + "</tbody>"
                + "</table>"
                + "<p>If you have any questions or concerns, please don't hesitate to contact us at <a href=\"mailto:" + contactEmail + "\">" + contactEmail + "</a>.</p>"
                + "<p>Thank you again for your order, and we look forward to serving you in the future.</p>"
                + "<p>Best regards,</p>"
                + "<p>" + companyName + "</p>"
                + "</div>"
                + "</body></html>";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject("Confirmation Email");
        helper.setText(htmlMessage, true);
        return message;
    }


    public void sendConfirmationEmail(Long orderId, String email) throws MessagingException {
        // Create the email message
        MimeMessage message = createConfirmationMessage(orderId, email);

        // Send the email
        javaMailSender.send(message);
    }



    private String getOrderDetails(Long order_id) {
        Optional<Order> optionalOrder = orderRepository.findById(order_id);
        Order order = optionalOrder.orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + order_id));

        StringBuilder sb = new StringBuilder();
        double totalPrice = 0.0;
        for (OrderItem item : order.getOrderItems()) {
            double itemPrice = item.getProduct().getPrice() * item.getQuantity();
            sb.append("<tr>")
                    .append("<td>").append(item.getProduct().getName()).append("</td>")
                    .append("<td>").append("VND : ").append(item.getProduct().getPrice()).append("</td>")
                    .append("<td>").append(item.getQuantity()).append("</td>")
                    .append("<td>").append("VND :").append(itemPrice).append("</td>")
                    .append("</tr>");
            totalPrice += itemPrice;
        }

        // Append total price to the end of the table
        sb.append("<tr>")
                .append("<td colspan=\"3\"><b>Total Price</b></td>")
                .append("<td><b>VND :").append(totalPrice).append("</b></td>")
                .append("</tr><br><br><br><br>");

        // Append address information
        sb.append("<tr>")
                .append("<td colspan=\"4\"><b>Shipping Address</b></td>")
                .append("</tr>")
                .append("<tr>")
                .append("<td>").append("Door Number: ").append(order.getAddress().getDoorNumber()).append("</td>")
                .append("<td>").append("Street: ").append(order.getAddress().getStreet()).append("</td>")
                .append("<td>").append("City: ").append(order.getAddress().getCity()).append("</td>")
                .append("<td>").append("District: ").append(order.getAddress().getDistrict()).append("</td>")
                .append("</tr>");

        return sb.toString();
    }
}
