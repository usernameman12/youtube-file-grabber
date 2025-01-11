const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
    const { url } = req.body;

    // Check if the URL is valid
    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        // Get video info and set the filename to the video title
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;

        // Set response headers for video download
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        // Stream the video to the client
        ytdl(url, { quality: 'highestvideo' }).pipe(res);
    } catch (error) {
        console.error('Error downloading the video:', error);
        res.status(500).json({ error: 'Failed to download the video' });
    }
};
