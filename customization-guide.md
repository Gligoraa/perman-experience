# ✂️ Barbershop Template: Customization Guide

To clone this website for a new business, you only need to update the following 6 core areas in `src/config/business-config.ts`:

1.  **Brand Identity (`name`, `tagline`)**: The business name and legal entities.
2.  **Promise/Philosophy (`heroPromise`, `philosophy`)**: The unique value proposition and story that differentiates this shop from others.
3.  **Visual Language (`theme`, `gallery`)**: Changing the primary accent color (e.g., Amber to Emerald or Crimson) and the portfolio photos.
4.  **Service Menu & Pricing (`services`)**: Localized prices and specific treatments (e.g., "Hot Towel Shave" vs "Hair Tattooing").
5.  **The Talent (`stylists`)**: Personalized profiles for the actual staff members, including their real bios and photos.
6.  **Social Proof & Contact (`reviews`, `contact`, `hours`)**: Real customer testimonials and specific location details.

---

## 🛠️ Implementation Steps
1.  **Clone** the `Website Template` folder.
2.  **Open** `src/config/business-config.ts`.
3.  **Replace** the data with the new shop's info.
4.  **Logo**: Replace the SVG in `Navbar.tsx` or update the `logo` field in config to point to a new image.
5.  **Deploy**: Run `npm run build`.
