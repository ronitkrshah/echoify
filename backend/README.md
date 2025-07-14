# Echoify Backend

## Endpoints (`/api/v1`)

-   `/stream/:id`

    ```json
    {
        "status": true,
        "data": "Streaming Link"
    }
    ```

-   `/searchSuggestions?q=RickRoll`

    ```json
    {
        "status": true,
        "data": ["rick roll"]
    }
    ```

-   `/songs?q=RickRoll`

    ```json
    {
        "status": true,
        "data": [
            {
                "id": "lYBUbBu4W08",
                "title": "Never Gonna Give You Up",
                "author": "Rick Astley",
                "duration": 214,
                "thumbnail": "https://lh3.googleusercontent.com/eC9DfRcYSk4FE-fvDCJSu_4xsKdVMKxwmFTYFZwP8OqB7R4TKxAjKoR-Kp1lXeRi2WddPFYulSte4eW-=w120-h120-l90-rj"
            }
        ]
    }
    ```

-   `/relatedSongs/[currentSongId]`

    ```json
    {
        "status": true,
        "data": [
            {
                "id": "lYBUbBu4W08",
                "title": "Never Gonna Give You Up",
                "author": "Rick Astley",
                "duration": 214,
                "thumbnail": "https://lh3.googleusercontent.com/eC9DfRcYSk4FE-fvDCJSu_4xsKdVMKxwmFTYFZwP8OqB7R4TKxAjKoR-Kp1lXeRi2WddPFYulSte4eW-=w120-h120-l90-rj"
            }
        ]
    }
    ```

-   `/playlists?q="bollywood"`

    ```json
    {
        "status": true,
        "data": [
            {
                "id": "VLRDCLAK5uy_k2M7Bug3ZvV6NgY8QLsSNPD5I-AQz7wMo",
                "name": "80s Bollywood",
                "thumbnail": "https://lh3.googleusercontent.com/twtZoAVWxJUgUk62bPEPDuxqXPEkReKeIc_31xi2jNRagPLYzBG356LUbBMB_xHJfbWWphbLWaIcsRA=w544-h544-l90-rj"
            }
        ]
    }
    ```

-   `/playlists/VLRDCLAK5uy_k2M7Bug3ZvV6NgY8QLsSNPD5I-AQz7wMo`
    ```json
    {
        "status": true,
        "data": {
            "title": "80s Bollywood",
            "totalVideos": "99 videos",
            "thumnail": "https://i9.ytimg.com/s_p/RDCLAK5uy_k2M7Bug3ZvV6NgY8QLsSNPD5I-AQz7wMo/maxresdefault.jpg?sqp=COy9x8MGir7X7AMICKnPpb0GEAE=&rs=AOn4CLDuXA6-7csZON-T1bX4neLkBr7DPA&v=1739155369",
            "videos": [
                {
                    "id": "sWqjZpBtcxc",
                    "title": "Aye Mere Humsafar Full Song | Qayamat Se Qayamat Tak | Udit N | Alka Y| Aamir Khan, Juhi Chawla",
                    "author": "T-Series Bollywood Classics",
                    "duration": 314,
                    "thumbnail": "https://i.ytimg.com/vi/sWqjZpBtcxc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDCQI10Hd6fp4GytCWVXqxxujOiEw"
                }
            ]
        }
    }
    ```
