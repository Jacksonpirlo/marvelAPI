const URL_API = 'https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=64e1b1b63c194bbb44e2578a292beb8c&hash=6c855cd153e64031b1b29e1d3a5ba44d'

const vm = Vue.createApp({
    data() {
        return {
            avengers: [],
            selectedAvenger: null,
            loading: true,
            error: null
        }
    },

    async mounted() {
    try {
            const res = await fetch(URL_API)
            if (!res.ok) {
                throw new Error(`HTTPS Error: ${res.statusText}`)
            }
            const data = await res.json()
            console.log(data)
            this.avengers =  data.data.results.map(character => {
                return {
                    id: character.id,
                    name: character.name,
                    imgUrl: `${character.thumbnail.path}.${character.thumbnail.extension}`,
                    description: character.description,
                    wiki: character.urls[1].url
                }
                console.log(data)
            })

    } catch (error) {
        console.log(error)
        this.error = error
    } finally {
        this.loading = false
    }
        },

        methods: {

            moreInformation(avenger) {
                if (avenger.description == "") {
                    avenger.description = `No there information about ${avenger.name}`
                } else {
                    this.selectedAvenger = avenger
                }
            },
            notInformation() {
                this.selectedAvenger = null
            }
        },

        computed: {
            lookAll() {
                return this.selectedAvenger == null
            }
        },

    template: `

    <div v-if="loading">Loading...</div>
    <div v-if="error"> {{ error }} </div>
    <div class="av-father" v-if="lookAll">

    <div v-for="avenger in avengers" :key="avenger.id" class="av-container">
        <img v-if="avenger.imgUrl" :src="avenger.imgUrl" alt=""/>
        <h3> {{ avenger.name }} </h3>
        <button @click="moreInformation(avenger)">More information</button>
    </div>
    </div>

    <div v-else class="av-container">
    <img v-if="selectedAvenger.imgUrl" :src="selectedAvenger.imgUrl" alt="">
    <h3> {{ selectedAvenger.name }} </h3>
    <p> {{ selectedAvenger.description }} <a :href="selectedAvenger.wiki" target="_blank">Look Wiki?</a></p>
    <button @click="notInformation">Close</button>
</div>
    `

}).mount('#app')