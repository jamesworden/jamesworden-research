### Mitigate GPS Spoofing

# Can we verify one is at a certain location using photos of the outside world?

This project has three API's that aim to answer this question:

- Route API: Every certain number of meters, fetch GPS coordinates between two GPS coordiantes.
- Point API: At a specific GPS coordinate, fetch the text extracted from images at that location. This uses Google StreetView to fetch images at a location and Google Cloud Vision to extract text from those images.
- Report API: Collects and compares text from each point on two different routes to determine the likelihood that the routes overlap.

Data from these API's were used in an undergraduate research project I contributed to at St. John's University.
