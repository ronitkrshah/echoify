# Echoify Backend

## Endpoints (`/api/v1`)

-   `/music/stream/:id`  
    Success Response
    ```json
    {
        "status": true,
        "url": "Streaming Link"
    }
    ```
    Error Response
    ```json
    {
        "status": false,
        "message": "Some Message"
    }
    ```
