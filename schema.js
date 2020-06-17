const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType
} = require('graphql')
const movies = require('./movies.json');

const movie = new GraphQLObjectType({
  name: 'Movie',
  fields: {
    title: {
      type: GraphQLString
    },
    cover: {
      type: GraphQLString
    },
    year: {
      type: GraphQLString
    },
    cost: {
      type: GraphQLFloat
    },
    starring: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'starring',
        fields: {
          name: {
            type: GraphQLString
          }
        }
      }))
    }
  }
});

const inputMovieType = new GraphQLInputObjectType({
  name: 'MovieInput',
  fields: {
    title: {
      type: GraphQLString
    },
    cover: {
      type: GraphQLString
    },
    year: {
      type: GraphQLString
    },
    cost: {
      type: GraphQLFloat
    },
    starring: {
      type: new GraphQLList(GraphQLString)
    }
  }
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      movies: {
        type: new GraphQLList(movie),
        resolve: () => movies
      },
      movie: {
        type: movie,
        args: {
          index: {
            type: GraphQLInt
          }
        },
        resolve: (r, {index}) => movies[index - 1]
      },
      starring: {
        type: new GraphQLList(movie),
        args: {
          star: {
            type: GraphQLString
          }      
        },
        resolve: (r, {star}) => movies.filter(movie=>{
          if(movie.starring.filter(starObj=>starObj.name === star).length >0)
            return movie
        })
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createMovie:{
        type:movie,
        args:{
          input:{type:inputMovieType}
        },
        resolve:(r, args) => {
          let movie = {
            title: args.input.title,
            cover: args.input.cover,
            year: args.input.year,
            cost: args.input.cost
          }
          let stars = []
          args.input.starring.map(strName=>{
            stars.push({name:strName})
            console.log(strName)
          })
          movie.starring = stars;
          movies.push(movie)
        }
      } 
    }
    
  })
})