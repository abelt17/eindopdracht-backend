import express from 'express';
import MusicAlbum from "../models/MusicAlbum.js";
import {faker} from "@faker-js/faker";

const router = express.Router();

router.use((req, res, next) => {
    const acceptHeader = req.headers['accept'] || '';
    console.log(`Client accepteert: ${acceptHeader}`);
    if (acceptHeader.includes('application/json')) {
        next()
    } else {
        res.status(400).json({error: 'Invalid Accept header'});
    }
})

router.options('/', (req, res, next) => {
    res.setHeader('Allow', 'GET, POST');
    res.status(204).send();
});

router.options('/:id', (req, res, next) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send()
});

router.get('/', async (req, res) => {
    try {
        const albums = await MusicAlbum.find();

        const collection = {
            "items": albums,
            "_links": {
                "self": {
                    "href": process.env.BASE_URL + "/musicAlbums"
                },
                "collection": {
                    "href": process.env.BASE_URL + "/musicAlbums"
                }
            }
        };
        res.json(collection)
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch albums'});
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const album = await MusicAlbum.findById(id);
    res.json(album);
});

router.post('/', async (req, res) => {
    try {
        const {method, amount, replace} = req.body;

        if (method === 'SEED') {

            if (replace) {
                await MusicAlbum.deleteMany({});
            }

            // Seed with fake data
            for (let i = 0; i < amount; i++) {
                await MusicAlbum.create({
                    title: faker.music.album(), // Album title
                    artist: faker.person.fullName(), // Artist or band name
                    genre: faker.music.genre(), // Genre of music
                    releaseDate: faker.date.past({years: 30}), // Random date within the past 30 years
                    tracklist: Array.from({length: faker.number.int({min: 5, max: 15})}, () => ({
                        title: faker.music.songName(), // Random song name
                        duration: `${faker.number.int({min: 2, max: 5})}:${faker.number.int({
                            min: 0,
                            max: 59
                        }).toString().padStart(2, '0')}` // Random duration (e.g., "3:45")
                    })),
                    coverImageUrl: faker.image.urlLoremFlickr({category: 'music'}) // Random music-related image
                });
            }

            return res.status(201).json({success: true});

        }
        const newAlbum = new MusicAlbum(req.body);
        const savedAlbum = await newAlbum.save();
        res.status(201).json(savedAlbum);
    } catch (err) {
        res.status(400).json({error: 'Failed to create album'});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const album = await MusicAlbum.findByIdAndUpdate(id, req.body, { new: true});
        res.status(200).json(album);

        // const {id} = req.params;
        // const album = await MusicAlbum.findById(id);
        // if (!album) {
        //     return res.status(404).json({ error: 'Album not found' });
        // }
        // Object.assign(album, req.body);
        // const saveChangedAlbum = await album.save();
        // res.status(201).json(saveChangedAlbum);
    } catch (err) {
        res.status(400).json({error: 'Failed to update album'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const album = await MusicAlbum.findByIdAndDelete(id);
        res.status(201).json(album);
    } catch (err) {
        res.status(400).json({error: 'Failed to delete album'});
    }
});

export default router;
