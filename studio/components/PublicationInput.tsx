import React, {useState} from 'react'
import {Box, Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {ObjectInputProps, set} from 'sanity'
import {lookupDOI} from '../lib/doi.mjs'

export function PublicationInput(props: ObjectInputProps) {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[failed,setFailed]=useState(false)
 const value=props.value as any
 const lookup=async()=>{
  setBusy(true);setMessage('');setFailed(false)
  try{
   const metadata=await lookupDOI(value?.doi)
   props.onChange(Object.entries(metadata).map(([name,content])=>set(content,[name])))
   setMessage('Datos recuperados. Revisa la referencia y pulsa Publicar. Si el DOI ya existe en la web, se actualizará sin duplicarlo.')
  }catch(error){setFailed(true);setMessage(error instanceof Error?error.message:'No se han podido recuperar los datos.')}
  finally{setBusy(false)}
 }
 return <Stack space={4}><Card padding={4} radius={2} border><Stack space={3}>
  <Text weight="semibold">Añadir una publicación por DOI</Text>
  <Text size={1} muted>Pega el DOI o su enlace. Después revisa los datos recuperados antes de publicar.</Text>
  <Flex gap={2} wrap="wrap"><Box flex={1} style={{minWidth:200}}><TextInput aria-label="DOI del artículo" placeholder="https://doi.org/10.…" value={value?.doi||''} readOnly={props.readOnly} onChange={event=>props.onChange(set(event.currentTarget.value,['doi']))}/></Box><Button text={busy?'Buscando…':'Recuperar datos'} tone="primary" disabled={busy||!value?.doi||props.readOnly} onClick={lookup}/></Flex>
  {message&&<Card padding={3} tone={failed?'critical':'positive'} radius={2}><Text size={1} role="status">{message}</Text></Card>}
 </Stack></Card>{props.renderDefault(props)}</Stack>
}
