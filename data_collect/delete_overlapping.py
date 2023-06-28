
def delete_overlapping(file_name1,file_name2):
    f = open(file_name1, 'r')
    f2 = open(file_name2, 'w')
    
    datalist = f.readlines()
    datalist = list(set(datalist))
    datalist.sort()
    
    for item in datalist:
        f2.write(item)
        
        
fin = 'url_data.txt'
fout = 'new_url_data.txt'
delete_overlapping(fin,fout)