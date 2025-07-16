# 🎵 Echoify Backend

Core Backend For Echoify Music App

<br />

## 🌐 Base URL

🛠 **You can self-host this backend on platforms like [Vercel](https://vercel.com), [Render](https://render.com), [Railway](https://railway.app), or your own VPS.**

> Base Endpoint: `https://DOMAIN/api/v1`

<br />

# 📡 Endpoints

### 🔊 Stream a Song

**GET** `/stream/:id`: Stream Directly

### 🔍 Search Suggestions

**GET** `/searchSuggestions?q=<query>`

Provides real-time search suggestions based on the query.

```json
{
    "status": true,
    "data": ["string", "string"]
}
```

### 🎶 Search Songs

**GET** `/songs?q=<query>`

Searches for songs based on the query string.

```json
{
    "status": true,
    "data": [
        {
            "id": "string",
            "title": "string",
            "author": "string",
            "duration": 0,
            "thumbnail": "string"
        }
        // ...more
    ]
}
```

### 🔁 Related Songs

**GET** `/relatedSongs/:currentSongId`

Returns a list of songs related to the given song ID.

```json
{
    "status": true,
    "data": [
        {
            "id": "string",
            "title": "string",
            "author": "string",
            "duration": 0,
            "thumbnail": "string"
        }
        // ...more
    ]
}
```

### 🎵 Playlist Search

**GET** `/playlists?q=<query>`

Searches for playlists based on the query.

```json
{
    "status": true,
    "data": [
        {
            "id": "string",
            "name": "string",
            "thumbnail": "string"
        }
        // ...more
    ]
}
```

### 📁 Playlist Details

**GET** `/playlists/:playlistId`

Returns full details and all videos from a given playlist.

```json
{
    "status": true,
    "data": {
        "title": "string",
        "totalVideos": "string",
        "thumnail": "string",
        "videos": [
            {
                "id": "string",
                "title": "string",
                "author": "string",
                "duration": 0,
                "thumbnail": "string"
            }
            // ... more
        ]
    }
}
```

### 📝 Get Song Lyrics

**GET** `/lyrics/:musicId`

Fetches the lyrics for the specified song by its ID.

```json
{
    "status": true,
    "data": "string"
}
```
