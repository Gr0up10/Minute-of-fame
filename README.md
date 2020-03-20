# minute of fame

To run and build docker use this command command:

`docker-compose up --build`

To run server without every time rebuilding, run following commands in separate terminal windows:
1. Run environment services `docker-compose -f docker-compose.dev.yml up`
3. Run our server, if windows `run.dev.bat`, if linux or os x `./run.dev.sh`

Now to apply new changes, you only need to restart `run.dev`