import requests
import json

def get_count(url):
    response = requests.get(url)
    data = response.json()
    return data["results"]["bindings"][0]["callret-0"]["value"]

def get_data(url):
    response = requests.get(url)
    data = response.json()
    return data["results"]["bindings"]

if __name__ == "__main__":
    count_url = "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX%20dbo%3A%20%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%20PREFIX%20dbp%3A%20%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%20SELECT%20COUNT(%3Fperson)%20WHERE%20%7B%20%3Fperson%20a%20dbo%3APerson%20.%20%3Fperson%20dbo%3Adescription%20%3Fdescription%20.%20%3Fperson%20dbp%3Aname%20%3Fname%20.%20%3Fperson%20dbo%3Athumbnail%20%3Fimage%20.%20FILTER(LANG(%3Fdescription)%20IN%20(%22en%22%2C%20%22de%22%2C%20%22fr%22%2C%20%22es%22))%20.%20%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on"
    data_url = "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+<http%3A%2F%2Fdbpedia.org%2Fontology%2F>+PREFIX+dbp%3A+<http%3A%2F%2Fdbpedia.org%2Fproperty%2F>+SELECT+DISTINCT+%3Fperson%2C+%3Fname%2C+%3Fdescription+%2C+%3Fimage+WHERE+%7B+%3Fperson+a+dbo%3APerson+.+%3Fperson+dbo%3Adescription+%3Fdescription+.+%3Fperson+dbp%3Aname+%3Fname+.+%3Fperson+dbo%3Athumbnail+%3Fimage+.+FILTER%28LANG%28%3Fdescription%29+%3D+'en'%29+.+%7D+OFFSET+{OFFSET}+LIMIT+{LIMIT}&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on"
    # count = get_count(count_url)
    # print(count)
    count = 0

    while True:
        print(f"Fetching data with OFFSET={count*10000}...")
        current_url = data_url.format(OFFSET=count*10000, LIMIT=10000)
        #print(f"Current URL: {current_url}")
        data = get_data(current_url)
        
        if not data:
            print("No more data to fetch.")
            break

        with open("data.csv", "a", encoding="utf-8") as f:
            for item in data:
                person = item["person"]["value"]
                name = item["name"]["value"]
                description = item["description"]["value"]
                image = item["image"]["value"]
                f.write(f"{person},{name},{description},{image}\n")
        
        count += 1