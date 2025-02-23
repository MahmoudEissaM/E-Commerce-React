import React from "react";

export function MapComponent() {
    return (
        <div className="text-center">
            <h3 className="text-warning mb-3">Find Us Here</h3>
            <iframe
                title="Google Map"
                width="80%"
                height="400"
                style={{ border: 0, borderRadius: "10px" }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110575.49853525852!2d31.18061670322219!3d30.044419599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840b03c010109%3A0x5c0b2e9b4a5d8b05!2z2YXYsdmD2LIg2KfZhNmB2K3YqSDYp9mE2K_ZitmC2KfZhA!5e0!3m2!1sen!2seg!4v1708212345678!5m2!1sen!2seg`}
            ></iframe>
        </div>
    );
}
