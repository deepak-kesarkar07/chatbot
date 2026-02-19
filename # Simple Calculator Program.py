for num in range(0, 1000):
    if num > 1:
        for i in range(2, num):
            if num % i == 0:
                break
        else:
            print(num)


