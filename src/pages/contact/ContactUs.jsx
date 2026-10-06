import React from 'react'

export default function ContactUs() {
    return (
        <>

        
          <section class="contact-section">
    <div class="container">

        <div class="contact-header">
            <span class="contact-label">GET IN TOUCH</span>
            <h1>Contact Us</h1>
            <p>
                Have a question or want to know more about our services?
                Send us a message and we’ll be happy to help.
            </p>
        </div>

        <div class="contact-grid">

  
            <div class="contact-info">

                <h2>Contact Info</h2>
                <p class="info-intro">
                    Feel free to reach out to us through the details below.
                </p>

                <div class="contact-item">
                    <div class="contact-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/>
                            <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                    </div>

                    <div>
                        <span>Address</span>
                        <p>611/998 (1st Floor), BJB Nagar</p>
                    </div>
                </div>

                <div class="contact-item">
                    <div class="contact-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="14" rx="2"/>
                            <path d="m4 7 8 6 8-6"/>
                        </svg>
                    </div>

                    <div>
                        <span>Email</span>
                        <p>
                            <a href="mailto:rsrath13@gmail.com">
                                rsrath13@gmail.com
                            </a>
                        </p>
                    </div>
                </div>

        
                <div class="contact-item">
                    <div class="contact-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6.6 3.5 9 3l2 5-2.2 1.8a14 14 0 0 0 5.4 5.4L16 13l5 2 .5 2.4a2 2 0 0 1-2.2 2.3C10.6 18.8 5.2 13.4 4.3 4.7A2 2 0 0 1 6.6 3.5Z"/>
                        </svg>
                    </div>

                    <div>
                        <span>Phone</span>
                        <p>
                            <a href="tel:+918895267838">
                                +91-88952-67838
                            </a>
                        </p>
                    </div>
                </div>

            </div>


            <div class="contact-form-wrapper">

                <h2>Contact Form</h2>
                <p class="form-intro">
                    Fill out the form below and we will get back to you soon.
                </p>

                <form class="contact-form">

                    <div class="form-row">

                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            placeholder="Enter subject"
                        />
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            placeholder="Write your message..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" class="contact-btn">
                        Send Message

                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12h13"/>
                            <path d="m13 6 6 6-6 6"/>
                        </svg>
                    </button>

                </form>

            </div>

        </div>

    </div>
</section>


        </>
    )
}
