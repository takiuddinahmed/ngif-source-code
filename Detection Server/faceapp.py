#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: nabil & taki
"""
import cv2
import numpy as np
from matplotlib import pyplot as plt
from flask import Flask, jsonify, request
from ngif_faceapp import face_encodings
from ngif_faceapp import load_image_file
from ngif_faceapp import compare_faces
from time import sleep
from _dont_delete import func
import os
from os import listdir, getcwd
from string import digits
app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret!'
# app.debug = True

result = ''
compare_result = ''
conf = 2
search_count = 0


@app.route('/license', methods=['POST'])
def key_check():
    l = request.form['lic']
    key = func()
    if (key):
        return "Yes"
    else:
        return "No"


@app.route('/source_image', methods=['POST'])
def image_function_1():
    img = request.form['source_image_request']
    img_info = cv2.imread(img)
    height, width, channels = img_info.shape
    color = ('b', 'g', 'r')
    for i, col in enumerate(color):
        histr = cv2.calcHist([img_info], [i], None, [256], [0, 256])
        plt.plot(histr, color=col)
        plt.xlim([0, 256])
    #print("Generating Color Distribution..")
    #print("Size of The Image : {} x {}".format(height,width))
    #print("Number of Channels : {}".format(channels))
    #print("Edge Detection Is Running..")
    plt.savefig("source_hist_source.png")
    location = os.path.join(os.getcwd(), 'source_hist_source.png')
    string = location + "," + str(height) + "," + \
        str(width) + "," + str(channels)
    print(string)
    return string


@app.route('/test_image', methods=['POST'])
def image_function_2():
    img = request.form['test_image_request']
    img_info = cv2.imread(img)
    height, width, channels = img_info.shape
    color = ('b', 'g', 'r')
    for i, col in enumerate(color):
        histr = cv2.calcHist([img_info], [i], None, [256], [0, 256])
        plt.plot(histr, color=col)
        plt.xlim([0, 256])
    #print("Generating Color Distribution..")
    #print("Size of The Image : {} x {}".format(height,width))
    #print("Number of Channels : {}".format(channels))
    #print("Edge Detection Is Running..")
    plt.savefig("paste_hist_found.png")
    location = os.path.join(os.getcwd(), 'paste_hist_found.png')
    string_2 = location + "," + \
        str(height) + "," + str(width) + "," + str(channels)
    print(string_2)
    return string_2


@app.route('/', methods=['POST'])
def index():
    return "yes"


@app.route('/get_progress', methods=['POST'])
def get_progress():
    global search_count
    return str(search_count)


@app.route('/get_total_file', methods=['POST'])
def progress_bar():
    count = 0
    folders = request.form['filters']
    filters = request.form['ranges']
    if not filters == "NO":
        filters = filters.split("/")
        start = int(filters[0])
        end = int(filters[1])
        #estimated_time = end - start
        file_list = list(range(start, end+1))
        print("file list : ", file_list)
        folders = folders.split(',')
        location = os.path.dirname(os.getcwd())
        adress = os.path.join(location, 'database')
        for i in folders:
            location = os.path.join(adress, i)
            for j in os.listdir(location):
                print(j)
                j = j.split("(")
                j = j[0]
                print(j)
                j = "".join(c for c in j if c in digits)
                print(j)
                print(type(j))
                try:
                    j = int(j)
                    print(type(j))
                    if j > start and j < end:
                        count += 1
                except:
                    count += 1
                print(count)
        return str(count)

    folders = folders.split(',')
    location = os.path.dirname(os.getcwd())
    adress = os.path.join(location, 'database')
    for i in folders:
        location = os.path.join(adress, i)
        files = len(os.listdir(location))
        count += files
        print(count)
    return str(count)


@app.route('/operation', methods=['POST'])
def post_handle():
    global result
    global search_count
    search_count = 0
    res = []
    data = request.form['address']
    filtered_names = request.form['filters']
    ranges = request.form['ranges']
    toleranceVal = float(request.form['tolerance'])

    print("tolerance ", toleranceVal)
    print(type(toleranceVal))

    if ranges == "NO":
        result = another_function(data, filtered_names, res, toleranceVal)
    else:
        result = another_function_range(
            data, filtered_names, res, ranges, toleranceVal)
    # result = "".join(result)
    result = ",".join(str(v) for v in result)
    # match = check_image(data,filtered_names)
    result = result.replace("[", "")
    result = result.replace("]", "")
    result = result.replace("'", "")
    # result = getcwd() + "/database/" + match
    print(result)
    return "Nothing"


@app.route('/result', methods=['POST'])
def res():
    global result
    if (len(result) < 5):
        result = ""
    return result


def another_function(data, filtered_names, result, toleranceVal):
    print(toleranceVal)
    filtered_names = filtered_names.split(",")
    if not filtered_names[-1]:
        del filtered_names[-1]
    print(filtered_names)
    if len(filtered_names) > 0:
        for i in filtered_names:
            print("Single Name : {}".format(i))
            r = check_image(data, i, toleranceVal)
            if r:
                result.append(r)
    else:
        r = check_image(data, filtered_names,toleranceVal)
        if r:
            result.append(r)
    return result


@app.route('/compare', methods=['POST'])
def compare():
    global compare_result
    compare_result = ''
    known = request.form['known']
    unknown = request.form['unknown']
    print(known, unknown)
    compare_result = compare_two_image(known, unknown)
    return compare_result


@app.route('/compare-result', methods=['POST'])
def compare_results():
    global compare_result
    return compare_result


def compare_two_image(known_image_location, unknown_image_location):
    known_image = load_image_file(known_image_location)
    unknown_image = load_image_file(unknown_image_location)

    known_image_encoding = face_encodings(known_image)[0]
    unknown_image_encoding = face_encodings(unknown_image)[0]
    result = compare_faces([known_image_encoding],
                           unknown_image_encoding, tolerance=0.5)
    sleep(0.2)
    if result == [True]:
        return 'True'
    else:
        return 'False'


def another_function_range(data, filtered_names, result, filters, toleranceVal):
    print(toleranceVal)
    filters = filters.split("/")
    start = filters[0]
    end = filters[1]
    filtered_names = filtered_names.split(",")
    if not filtered_names[-1]:
        del filtered_names[-1]
    print(filtered_names)
    if len(filtered_names) > 0:
        for i in filtered_names:
            print("Single Name : {}".format(i))
            r = check_image_range(data, i, start, end, toleranceVal)
            if(r):
                result.append(r)
    else:
        r = check_image_range(data, filtered_names, start, end)
        if (r):
            result.append(r)
    return result


def check_image(address, filtered_names, toleranceVal):
    global search_count
    counter = 0
    file_location = []
    matchImages = ""
    known_image_location = address
    database_image_location = os.path.dirname(os.getcwd())
    database_image_location = os.path.join(database_image_location, 'database')
    database_image_location = os.path.join(
        database_image_location, filtered_names)
    known_image = load_image_file(known_image_location)
    known_image_encoding = face_encodings(known_image)[0]
    try:
        for index, image in enumerate(listdir(database_image_location)):
            location = os.path.join(database_image_location, str(image))
            # print(database_image_location)
            unknown_image = load_image_file(location)
            # unknown_image = load_image_file(database_image_location + str(image))

            unknown_image_encoding = face_encodings(unknown_image)[0]
            result = compare_faces([known_image_encoding],
                                   unknown_image_encoding, tolerance=toleranceVal)
            sleep(0.01)
            search_count += 1
            if result == [True]:
                # matchImages.append(image)
                matchImages = image
                print("match" + image)
                # emit("result", "match " + image)
                counter += 1
                print("{} Match Found.File Name : {}".format(counter, image))
                file_location.append(os.path.join(
                    database_image_location, image))
                print(file_location)
            else:
                # print("not")
                print(
                    'result', "[{}] {} Matching ---> {}".format(index+1, image, result))
    except:
        pass
    # return matchImages
    return file_location


def check_image_range(address, filtered_names, start, end, toleranceVal):
    global search_count
    print("image checking..... ")
    counter = 0
    file_location = []
    matchImages = ""
    known_image_location = address
    database_image_location = os.path.dirname(os.getcwd())
    database_image_location = os.path.join(database_image_location, 'database')
    database_image_location = os.path.join(
        database_image_location, filtered_names)
    known_image = load_image_file(known_image_location)
    known_image_encoding = face_encodings(known_image)[0]

    try:
        for index, image in enumerate(sorted(listdir(database_image_location))):
            print(image)
            a = image
            a = a.split("(")
            a = a[0]
            # print(a)
            a = "".join(c for c in a if c in digits)
            # print(a)

            if int(a) < int(start):
                continue
            if int(a) > int(end):
                continue
            search_count += 1
            print(a, start, end)
            location = os.path.join(database_image_location, str(image))
            print(database_image_location)
            unknown_image = load_image_file(location)
            # unknown_image = load_image_file(database_image_location + str(image))

            unknown_image_encoding = face_encodings(unknown_image)[0]
            result = compare_faces([known_image_encoding],
                                   unknown_image_encoding, tolerance=toleranceVal)
            sleep(0.1)
            if result == [True]:
                # matchImages.append(image)
                matchImages = image
                print("match" + image)
                # emit("result", "match " + image)
                counter += 1
                print("{} Match Found.File Name : {}".format(counter, image))
                file_location.append(os.path.join(
                    database_image_location, image))
                print(file_location)
            else:
                # print("not")
                print(
                    'result', "[{}] Matching ---> {}".format(index+1, result))
    except:
        pass
    # return matchImages
    return file_location


if __name__ == '__main__':
    app.run()
