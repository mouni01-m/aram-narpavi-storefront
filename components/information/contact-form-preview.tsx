export function ContactFormPreview() {
  return (
    <form className="contact-form-preview" aria-describedby="contact-form-status">
      <div id="contact-form-status" className="draft-content-notice">
        <strong>Sending is not enabled</strong>
        <p>This form is a layout preview. It cannot submit, store or deliver a message.</p>
      </div>
      <fieldset disabled>
        <legend>Message details</legend>
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" />
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" />
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={6} />
        <button className="button" type="submit" disabled>Send message unavailable</button>
      </fieldset>
    </form>
  );
}
