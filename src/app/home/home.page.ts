import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Tarefas } from './home.mode';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tarefas: Tarefas[] = [];

  constructor(private alerta: AlertController, private toastController: ToastController) {
    let dados = localStorage.getItem('TarefasDB');
    if(dados != null){
      this.tarefas = JSON.parse(dados);
    }
   }

  async showAdd() {
    const screen = await this.alerta.create({
      header: 'O que deseja fazer ?',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'O que deseja fazer ?'
        }
        
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () =>{console.log('Excluido')}
        },
        {
          text: 'Adicionar',
          handler: (form)=> {
                this.atualizarTarefas(form);
                          }
        }

      ]
    });
    screen.present();
  }
    atualizarTarefas(form: any){
      if(!form.task || form.task.trim() == ''){
        this.showToast(`A tarefa precisa ser preenchida`)
        return;
      }
                      let obj ={id: this.getId(this.tarefas),
                      descricao: form.task,
                      status: false};
      
                      this.tarefas.push(obj)
                      localStorage.setItem('TarefasDB', JSON.stringify(this.tarefas))
                      
    }


  apagar(id: number){
    let index = this.tarefas.findIndex(tarefa => tarefa.id == id);

    this.tarefas.splice(index, 1);

    this.showToast('Tarefa apagada com sucesso!');
  }

  getId(dados: Tarefas[]): number{
    let tamanho: number = (dados.length) +1;
    return tamanho; 
  }
  

  async showToast(mensagem: string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toast-config'
      
    });
  toast.present();
  }

  async showEdit(tarefa: Tarefas){
    const screen = await this.alerta.create({
      header: 'Editar Tarefa',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          value: tarefa.descricao
        },
      ],
      buttons:[
        {
          text: 'Cancelar',
          handler: () => {console.log(`editar tarefa`)}
        },
      {
        text: 'Salvar',
        handler: (form) => {
          tarefa.descricao = form.newTask;
        }
      
      }
    ]
    });
    screen.present();
  }

  alterarStatus(tarefa: Tarefas){
    tarefa.status = !tarefa.status;
  }
}
