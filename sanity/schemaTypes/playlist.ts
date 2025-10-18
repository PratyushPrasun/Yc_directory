import { defineField, defineType } from "sanity";


export const palylist = defineType({
    name:"palylist",
    title:'Palylists',
    type:'document',
    fields:[
        defineField({
            name:'title',
            type:'string',
        }),
        defineField({
            name:'slug',
            type:'slug',
            options:{
                source:"title"
            }
        }),
        defineField({
            name:'select',
            type:'array',
            of:[{type:"reference", to:[{type:"startup"}]}]
        }),    
    ],
})