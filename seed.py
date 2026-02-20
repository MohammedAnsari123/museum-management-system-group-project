from pymongo import MongoClient
import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['miuzeum_db']

def seed_data():
    # Museums
    if db.museums.count_documents({}) == 0:
        print("Seeding Museums...")
        museums = [
            {'Name': 'National Museum', 'City': 'Delhi', 'State': 'Delhi', 'Type': 'History', 'Established': '1949', 'Latitude': 28.61, 'Longitude': 77.20},
            {'Name': 'Indian Museum', 'City': 'Kolkata', 'State': 'WB', 'Type': 'Culture', 'Established': '1814', 'Latitude': 22.57, 'Longitude': 88.36},
        ]
        db.museums.insert_many(museums)
        print(f"Inserted {len(museums)} museums.")

    # Bookings
    if db.bookings.count_documents({}) == 0:
        print("Seeding Bookings...")
        bookings = [
            {'TicketID': 'TKT001', 'Museum': 'National Museum', 'Date': '2023-11-01', 'Time': '10:00', 'People': 2, 'TourType': 'General', 'VisitorName': 'John Doe', 'VisitorEmail': 'john@example.com', 'Attended': 'No'},
            {'TicketID': 'TKT002', 'Museum': 'Indian Museum', 'Date': '2023-11-02', 'Time': '14:00', 'People': 4, 'TourType': 'Guided', 'VisitorName': 'Jane Smith', 'VisitorEmail': 'jane@example.com', 'Attended': 'Yes'},
        ]
        db.bookings.insert_many(bookings)
        print(f"Inserted {len(bookings)} bookings.")

    # Ratings
    if db.ratings.count_documents({}) == 0:
        print("Seeding Ratings...")
        ratings = [
            {'Museum': 'National Museum', 'Rating': 5, 'Date': '2023-11-01', 'Time': '12:00', 'VisitorName': 'John', 'VisitorEmail': 'john@example.com', 'TicketID': 'TKT001', 'Review': 'Great experience!'},
            {'Museum': 'Indian Museum', 'Rating': 4, 'Date': '2023-11-02', 'Time': '16:00', 'VisitorName': 'Jane', 'VisitorEmail': 'jane@example.com', 'TicketID': 'TKT002', 'Review': 'Nice collection.'},
        ]
        db.ratings.insert_many(ratings)
        print(f"Inserted {len(ratings)} ratings.")
        
    print("Seeding complete.")

if __name__ == '__main__':
    seed_data()
