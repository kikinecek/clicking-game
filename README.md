# Team clicking game

## Endpoints
### /auth/sing-up
Endpoint serves to sing up customer. Accepts **email** and **password** in the body.

### /auth/sign-in
Endpoint serves to sign in customer. Accepts **email** and **password** in the body.

## /game/team-click
Endpoint servers to store clicks for specific team. Accepts **teamName** and **numberOfClicks** in the body.
**numberOfClicks** is optional. Since the game is about clicking and server spammed by unnecessary http requests
is not pleasant there should be option to debounce the clicking so it can be sent as 1 http request. If the debounce is implemented
use **numberOfClicks** otherwise do not specify it and click is counted as 1.

## /team/leaderboard
Endpoint servers to get leaderboard of current team statistics (team names and their clicks). Accepts **selectOptions** in the body.
**selectOptions** currently supports only pagination.

## /team/:name
Endpoint servers to get specific team data by it's name. Team name has to be included as path parameter.
The returned team includes information about customers click counts.


## Possible improvements

## data validation
Input data are validated in controllers to avoid missing required data
but there should be middleware implemented to properly validate data and its type via for example ZOD.

## auth
There is only very simple JW token validity check.

## select options
There is only support pagination now. There could be more options like filtering or ordering data.
