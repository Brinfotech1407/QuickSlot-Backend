INSERT INTO users (id, name) VALUES
  (1, 'Aarav'),
  (2, 'Diya'),
  (3, 'Kabir')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO venues (id, name, sport, area, address) VALUES
  (1, 'Smash Arena', 'badminton', 'Satellite', '12 Court Road, Satellite'),
  (2, 'Green Turf Club', 'football turf', 'Bopal', '88 Turf Lane, Bopal'),
  (3, 'Ace Badminton Hub', 'badminton', 'Prahlad Nagar', '4 Shuttle Street, Prahlad Nagar'),
  (4, 'Prime Box Cricket', 'box cricket', 'Thaltej', '19 Boundary Avenue, Thaltej')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sport = EXCLUDED.sport,
  area = EXCLUDED.area,
  address = EXCLUDED.address;

SELECT setval(pg_get_serial_sequence('venues', 'id'), (SELECT MAX(id) FROM venues));

INSERT INTO slots (venue_id, start_time, end_time)
SELECT
  v.id,
  make_time(hour_value, 0, 0),
  make_time(hour_value + 1, 0, 0)
FROM venues v
CROSS JOIN generate_series(6, 21) AS hour_value
ON CONFLICT (venue_id, start_time, end_time) DO NOTHING;
