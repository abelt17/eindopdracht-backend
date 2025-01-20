import mongoose from 'mongoose';

const musicAlbumSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Album title
    artist: { type: String, required: true }, // Artist or band name
    genre: { type: String, required: true }, // Genre of the music
    releaseDate: { type: Date, required: true }, // Release date of the album
    tracklist: [{ title: String, duration: String }], // Array of tracks with title and duration
    coverImageUrl: { type: String, required: true } // URL for the album's cover image
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret._links = {
                self: {
                    href: process.env.BASE_URL + `/MusiAlbums/${ret.id}`
                },
                collection: {
                    href: process.env.BASE_URL + `/MusicAlbums`
                }
            };

            delete ret._id;
        }
    }
});

const MusicAlbum = mongoose.model('MusicAlbum', musicAlbumSchema);

export default MusicAlbum;
