export default class QueueHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;


        stream.onstream = (act) => {
            console.log("start stream")
            let title_input = $("#title_input").val()
            console.log(title_input)
            let description_input = $("#description_input").val()
            this.send('queue', {'stream_type': act.stream_type, 'id': act.id, 'title': title_input , 'description': description_input});
        }
    }

    handle_message(name, packet) {
        if (name === "set_stream") {
        console.log('Set stream')
        console.log(packet)
        document.getElementById("stream_title").innerHTML = packet.title;
        document.getElementById("stream_description").innerHTML = packet.description;
        document.getElementById("streamer_name").innerHTML = packet.publisher
        //this.stream.watchStream(packet.id);
        }
        if (name === "stop") this.stream.stopStream();


        if (name === "update_places")
        {
            if (packet.queue.length >=1)
            {
                //удаление информационных полей с очереди
                let info_to_delete = document.getElementById("queue_info_title")
                if (typeof info_to_delete === 'undefined' || info_to_delete === null)
                {

                }
                else
                {
                info_to_delete.remove()
                }
                //удаление всех
                var queue_list = document.querySelectorAll('.queue-slider__ul__li');
                queue_list.forEach(function(item, index, array)
                {
                item.remove()
                }
                );
                //добавление всех
                packet.queue.forEach(function(item, index, array)
                {
                //console.log(item, index);
                //document.getElementById("q"+index).innerText = item

                var queue = document.getElementById('queue')

                var queue_element = document.createElement('li')
                queue_element.className = "queue-slider__ul__li"

                var queue_element_div = document.createElement('div')

                var queue_element_div_img_link = document.createElement('a')
                queue_element_div_img_link.href = '/profile_' + item +'/'

                var queue_element_div_img = document.createElement('img')
                queue_element_div_img.className = "queue-slider__ul__li__img"
                queue_element_div_img.src = "/static/queue.jpg"


                var queue_element_div_name = document.createElement('p')
                queue_element_div_name.id = "q"+index
                queue_element_div_name.innerText = item

                queue_element_div_img_link.appendChild(queue_element_div_img)
                queue_element_div.appendChild(queue_element_div_img_link)
                queue_element_div.appendChild(queue_element_div_name)

                queue_element.appendChild(queue_element_div)

                queue.appendChild(queue_element)
                }
                );
                //обновление картинок
                var img = document.querySelectorAll('.queue-slider__ul__li__img');
                img.forEach(function(item, index, array)
                {
                var queueuser = document.getElementById("q"+index);
                item.src = 'https://avatars.dicebear.com/api/human/' + queueuser.innerText + '.svg';
                }
                );
            }
            else
            {
            let info_to_add = document.getElementById("queue_info_title")
                if (typeof info_to_add === 'undefined' || info_to_add === null)
                {
                    //удаление всех
                    var queue_list = document.querySelectorAll('.queue-slider__ul__li');
                    queue_list.forEach(function(item, index, array)
                    {
                    item.remove()
                    }
                    );
                    //плажка
                    var noih = document.createElement("h2") //no one is here
                    noih.id = "queue_info_title"
                    noih.innerText = "Здесь никого нет :("

                    var queue = document.getElementById('queue')
                    queue.appendChild(noih)
                }
                else
                {
                }
            }
        }


        if (name === "set_time") document.getElementById("stream-timer-overlay").innerHTML = packet.time;
        if (name == "update_viewers") document.getElementById("view_count").innerText = packet.count;
    }
}
