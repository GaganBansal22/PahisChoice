import React from 'react'

function ContactUs() {
    return (

        <div className='md:mt-[8rem] mt-[5rem] mx-5 md:mx-20'>
            <h1 className='text-center font-bold text-3xl'>Contact Us</h1>
            <h1 className='font-bold text-xl mt-8'>Customer Support</h1>
            <br/>
            <span>For any inquiries, assistance, or feedback, our dedicated customer support team is here to help. Reach out to us via:</span>

            <ul className='list-disc ml-8'>
                <li> Email: support@yourstore.com</li>
                <li>Phone: +1 (800) 123-4567 (Mon-Fri, 9:00 AM - 6:00 PM)</li>
            </ul>
            <br/>
            <h1 className='font-bold text-xl'>Business Inquiries</h1><br/>
            <span>If you have business-related questions, partnership proposals, or wholesale inquiries, please contact our business team:</span>
            <ul className='list-disc ml-8'>
                <li> Email: support@yourstore.com</li>
                <li>Phone: +1 (800) 123-4567 (Mon-Fri, 9:00 AM - 6:00 PM)</li>
            </ul>
            <br/>
            <h1 className='font-bold text-xl'>Visit Our Store</h1><br/>
            <p>
            Feel free to visit our physical store at:
<br/>
YourStore 123 Main Street City, State ZIP Code  
            </p>
            <br/>
            <h1 className='font-bold text-xl'>Social Media</h1><br/>
            <span>Stay connected with us on social media:</span>

            <ul className='list-disc ml-8'>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
            </ul>
            <br/>
        </div>

    )
}

export default ContactUs
