



# This is the solution for the decoder function in Python. The idea is that you first load the file, and split up each line into a separate list of the correlating number and word and sort by the number. 
# After the cipher is sorted, you iterate through the list and add the word located on the trailing end of each pyramid base. The index is calculated at every step and updated the index by the pyramid base size + 1. More or less this is a Fibonacci sequence starting at zero. You add a space between each word and then strip off the final space returning the decoded message.
# Read the File
def split_and_sort(file_name):
  with open(file_name,'r') as file:
    keys = []
    for line in file:
      # Convert each line into a list and Update the key to an int
      newLine = line.split()
      key = [int(newLine[0]),newLine[1]]
      keys.append(key)
    # Sort by each number
    sorted_list = sorted(keys, key=lambda x:x[0])
    return sorted_list

def decode(message_file):
  cipher = split_and_sort(message_file)
  index = 0
  base_size = 0
  decoded_message = ""
  # Iterate through the sorted cipher and add each end of the pyramid to the decoded message
  while (index <= len(cipher)):
    decoded_message += cipher[index][1] + " "
    base_size += 1 # increase the base size every step
    index += base_size + 1 # updated the index accordingly
  return decoded_message.strip() # Remove the trailing space
    
decoded_message = decode("coding_qual_input.txt")
print(decoded_message)



# Both of these functions look very similar by taking the approach of slicing and appending subsets of the num list incrementally and returning it only if the final subset is equal to the step size. The issue with Response A is that the step and subsets variables are being redefined with every while loop. This causes the function to only return the final number of the nums list because the step variable is constantly being reset to 1. Therefore, response B is the only chatbot that returns the correct code.