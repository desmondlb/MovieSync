from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import threading
import sys

def test(roomname,uname):
    brave_path = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'

    # Set the options for the Brave browser
    options = webdriver.ChromeOptions()
    options.binary_location = brave_path

    # Start the Brave browser
    driver = webdriver.Chrome(options=options)

    driver.get('http://34.202.237.67:3000/landing')

    # Wait for the "Join Room" button to be clickable
    join_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Join Room']"))
    )

    # Find the room code input element and enter the room code

    room_code_input = driver.find_element(By.ID, 'roomname')
    room_code_input.clear()  # clear any existing text in the input field
    room_code_input.send_keys("TSip6")

    # Find the username input element and enter the username
    username_input = driver.find_element(By.ID, 'username_join')
    username_input.clear()  # clear any existing text in the input field
    username_input.send_keys("desmond")

    # Click the "Join Room" button
    join_button.click()

    # Wait for the next page to load
    while True:
        pass

# Create an array to hold the threads
threads = []
room_name = sys.argv[1]
# Create 20 threads and add them to the array
for i in range(2):
    t = threading.Thread(target=test, args=(room_name, "user"+str(i)))
    threads.append(t)

# Start all the threads
for t in threads:
    t.start()

# Wait for all the threads to finish
for t in threads:
    t.join()

# Close the driver
#driver.quit()
# python orchestrate.py 192.168.0.1