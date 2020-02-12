getwd()
setwd() #set this right before starting.

library(ggplot2)
library(languageR)
library(lme4)
library(lmerTest)
library(tidyverse)
library(dplyr)

#All library packages are up here, assuming that those will be needed for stats. 

#For the script below: just run through it until the real read.pcibex() command, where you will have to insert the name of your results file. 

read.pcibex <- function(filepath, auto.colnames=TRUE, fun.col=function(col,cols){cols[cols==col]<-paste(col,"Ibex",sep=".");return(cols)}) {
  n.cols <- max(count.fields(filepath,sep=",",quote=NULL),na.rm=TRUE)
  if (auto.colnames){
    cols <- c()
    con <- file(filepath, "r")
    while ( TRUE ) {
      line <- readLines(con, n = 1, warn=FALSE)
      if ( length(line) == 0) {
        break
      }
      m <- regmatches(line,regexec("^# (\\d+)\\. (.+)\\.$",line))[[1]]
      if (length(m) == 3) {
        index <- as.numeric(m[2])
        value <- m[3]
        if (index < length(cols)){
          cols <- c()
        }
        if (is.function(fun.col)){
          cols <- fun.col(value,cols)
        }
        cols[index] <- value
        if (index == n.cols){
          break
        }
      }
    }
    close(con)
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=cols))
  }
  else{
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=seq(1:n.cols)))
  }
}


#So run the first part until here. That is just a PennController script to make life easier.

#Next: read in your results file(s) with the read.pcibex() command, that will give you a neat table. Read them in, and turn them into variables. 

read.pcibex("resultsB.csv")

# Below: creating dataframes of the separate lists. rbind(dataframe, dataframe, etc, etc) will put all the results 
# together in a long list, enabling analysis over all the results. 

df1 <- read.pcibex("resultsA.csv")
df2 <- read.pcibex("resultsB.csv")


resultstotal <- rbind(df1, df2) #binding all the lists, and then turning it into another df. 

View(resultstotal) #check if it worked
summary(resultstotal) #check if it worked 2.0 and see if the basic numbers add up.


