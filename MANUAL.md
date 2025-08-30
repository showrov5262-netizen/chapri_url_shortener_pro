# User Manual

This manual provides a guide on how to use the features of the ChapriURL Pro application.

## 1. Logging In

-   Navigate to the application's home page.
-   Use the following credentials to log in:
    -   **Username:** `admin`
    -   **Password:** `chapri`

## 2. Dashboard

The dashboard is the main view after logging in. It gives you a quick overview of your links and their performance.

-   **Stats Cards:** View total links, total clicks, and the average number of clicks per link.
-   **Links Table:** A list of all your shortened links. You can see the title, destination URL, short code, and total clicks.

### Creating a New Link

1.  Click the **"Create Link"** button on the dashboard.
2.  Fill in the basic information:
    -   **Destination URL:** The long URL you want to shorten.
    -   **Title:** A descriptive name for your link for easy identification.
    -   **Custom Short Code (Optional):** A custom alias for your link (e.g., `summer-sale`). If left blank, a random one is generated.
3.  Explore the **Advanced Options** in the accordions for more control.

## 3. Configuring the AI Provider

AI-powered features like analytics summaries and bot detection require a Google Gemini API key.

1.  Navigate to **Settings** from the sidebar, then click **"Configure AI Settings"**.
2.  **For Local Testing:**
    -   Paste your Gemini API key into the input field. The application uses this key for local development. Your key is stored in your browser's session and is not sent anywhere else.
    -   Click **"Check Status"** to verify that the key is valid and can connect to the AI service. A "Valid" badge will appear if successful.
3.  **For Deployed Applications:**
    -   For a production environment, you should set the `GEMINI_API_KEY` as an environment variable on your hosting platform. The application will automatically use this key.

## 4. Managing Loading Pages

You can create custom HTML pages that are shown to users during a redirect delay.

### Creating and Editing Designs

1.  Navigate to **Loading Pages** from the sidebar.
2.  You will see a list of your existing designs and a configuration panel.
3.  To create a new design, click the **"Create New"** button.
4.  To edit an existing one, click the **"Edit"** button on its card.
5.  An editor dialog will appear. You can write or paste HTML, CSS (`<style>` tags), and JavaScript (`<script>` tags).
6.  Click **"Save Design"**. Your new design will be saved in your browser's local storage and will be available for use.

### Global Configuration

On the **Loading Pages** screen, you can set the default behavior for all links:
-   **Enable Loading Pages:** A master switch to turn the feature on or off globally.
-   **Display Mode:**
    -   **Random:** A random loading page from your designs will be shown.
    -   **Specific:** A specific page you select from the dropdown will always be used by default.

## 5. Per-Link Loading Page Overrides

You can override the global loading page settings for any individual link.

1.  When creating a new link, first enable **"Meta Refresh Redirect"** under the "Redirection Options". This is required to create a redirect delay.
2.  This will enable the **"Loading Page"** accordion section at the bottom.
3.  Expand the "Loading Page" section and enable the **"Configure Loading Page"** toggle.
4.  You can then choose to:
    -   **Use Global Setting:** Inherit the default behavior.
    -   **Show a random loading page:** Force a random page for this link.
    -   **Use a specific loading page:** Select one of your saved designs from the dropdown for this link only.

This allows for powerful customization, such as matching a loading page's branding to a specific marketing campaign link.
