export declare const SITE_SETTINGS_SEED: {
    siteName: string;
    siteShortName: string;
    siteTagline: string;
    heroHeadline: string;
    siteDescription: string;
    heroVideo: string;
    heroVideoPoster: string;
    contact: {
        phone: string;
        whatsapp: string;
        instagram: string;
        instagramUrl: string;
        addressLines: string[];
        address: string;
        postalCode: string;
        area: string;
        hours: {
            weekday: {
                label: string;
                slots: string[];
            };
            sunday: {
                label: string;
                slots: string[];
            };
        };
        hoursSummary: string;
    };
    socialLinks: {
        name: string;
        href: string;
        icon: string;
    }[];
    aboutStory: {
        title: string;
        headline: string;
        paragraphs: string[];
        image: string;
    };
    aboutMission: {
        title: string;
        headline: string;
        description: string;
        icon: string;
    };
    aboutVision: {
        title: string;
        headline: string;
        description: string;
        icon: string;
    };
};
export declare function seedCmsContent(): Promise<void>;
