

这篇总结主要是基于我Java并发技术系列的文章而形成的的。主要是把重要的知识点用自己的话说了一遍，可能会有一些错误，还望见谅和指点。谢谢

更多详细内容可以查看我的专栏文章：Java并发技术指南

https://blog.csdn.net/column/details/21961.html
<!-- more -->

## 线程安全

线程安全一般指多线程之间的操作结果不会因为线程调度的顺序不同而发生改变。

## 互斥和同步

    互斥一般指资源的独占访问，同步则要求同步代码中的代码顺序执行，并且也是单线程独占的。

## JMM内存模型

    JVM中的内存分区包括堆，栈，方法区等区域，这些内存都是抽象出来的，实际上，系统中只有一个主内存，但是为了方便Java多线程语义的实现，以及降低程序员编写并发程序的难度，Java提出了JMM内存模型，将内存分为主内存和工作内存，工作内存是线程独占的，实际上它是一系列寄存器，编译器优化后的结果。

## as-if-Serial，happens-before

    as if serial语义提供单线程代码的顺序执行保证，虽然他允许指令重排序，但是前提是指令重排序不会改变执行结果。

## volatile

    volatile语义实际上是在代码中插入一个内存屏障，内存屏障分为读写，写读，读读，写写四种，可以用来避免volatile变量的读写操作发生重排序，从而保证了volatile的语义，实际上，volatile修饰的变量强制要求线程写时将数据从缓存刷入主内存，读时强制要求线程从主内存中读取，因此保证了它的可见性。
    
    而对于volatile修饰的64位类型数据，可以保证其原子性，不会因为指令重排序导致一个64位数据被分割成两个32位数据来读取。

## synchronized和锁优化

    synchronized是Java提供的同步标识，底层是操作系统的mutex lock调用，需要进行用户态到内核态的切换，开销比较大。
    synchronized经过编译后的汇编代码会有monitor in和monitor out的字样，用于标识进入监视器模块和退出监视器模块，
    监视器模块watcher会监控同步代码块中的线程号，只允线程号正确的线程进入。
    
    Java在synchronized关键字中进行了多次优化。
    
    比如轻量级锁优化，使用锁对象的对象头做文章，当一个线程需要获得该对象锁时，线程有一段空间叫做lock record，用于存储对象头的mask word，然后通过cas操作将对象头的mask word改成指向线程中的lockrecord。
    如果成功了就是获取到了锁，否则就是发生了互斥。需要锁粗化，膨胀为互斥锁。
    
    偏向锁，去掉了更多的同步措施，检查mask word是否是可偏向状态，然后检查mask word中的线程id是否是自己的id，如果是则执行同步代码，如果不是则cas修改其id，如果修改失败，则出现锁争用，偏向锁失效，膨胀为轻量级锁。
    
    自旋锁，每个线程会被分配一段时间片，并且听候cpu调度，如果发生线程阻塞需要切换的开销，于是使用自旋锁不需要阻塞，而是忙等循环，一获取时间片就开始忙等，这样的锁就是自旋锁，一般用于并发量比较小，又担心切换开销的场景。

## CAS操作
    CAS操作是通过硬件实现的原子操作，通过一条指令完成比较和赋值的操作，防止发生因指令重排导致的非原子操作，在Java中通过unsafe包可以直接使用，在Java原子类中使用cas操作来完成一系列原子数据类型的构建，保证自加自减等依赖原值的操作不会出现并发问题。
    
    cas操作也广泛用在其他并发类中，通过循环cas操作可以完成线程安全的并发赋值，也可以通过一次cas操作来避免使用互斥锁。

## Lock类

### AQS

AQS是Lock类的基石，他是一个抽象类，通过操作一个变量state来判断线程锁争用的情况，通过一系列方法实现对该变量的修改。一般可以分为独占锁和互斥锁。

AQS维护着一个CLH阻塞队列，这个队列主要用来存放阻塞等待锁的线程节点。可以看做一个链表。

一：独占锁
独占锁的state只有0和1两种情况（如果是可重入锁也可以把state一直往上加，这里不讨论），state = 1时说明已经有线程争用到锁。线程获取锁时一般是通过aqs的lock方法，如果state为0，首先尝试cas修改state=1，成功返回，失败时则加入阻塞队列。非公共锁使用时，线程节点加入阻塞队列时依然会尝试cas获取锁，最后如果还是失败再老老实实阻塞在队列中。

独占锁还可以分为公平锁和非公平锁，公平锁要求锁节点依据顺序加入阻塞队列，通过判断前置节点的状态来改变后置节点的状态，比如前置节点获取锁后，释放锁时会通知后置节点。

非公平锁则不一定会按照队列的节点顺序来获取锁，如上面所说，会先尝试cas操作，失败再进入阻塞队列。

二：共享锁
共享锁的state状态可以是0到n。共享锁维护的阻塞队列和互斥锁不太一样，互斥锁的节点释放锁后只会通知后置节点，而共享锁获取锁后会通知所有的共享类型节点，让他们都来获取锁。共享锁用于countdownlatch工具类与cyliderbarrier等，可以很好地完成多线程的协调工作

### 锁Lock和Conditon

Lock 锁维护这两个内部类fairsync和unfairsync，都继承自aqs，重写了部分方法，实际上大部分方法还是aqs中的，Lock只是重新把AQS做了封装，让程序员更方便地使用Lock锁。

和Lock锁搭配使用的还有condition，由于Lock锁只维护着一个阻塞队列，有时候想分不同情况进行锁阻塞和锁通知怎么办，原来我们一般会使用多个锁对象，现在可以使用condition来完成这件事，比如线程A和线程B分别等待事件A和事件B，可以使用两个condition分别维护两个队列，A放在A队列，B放在B队列，由于Lock和condition是绑定使用的，当事件A触发，线程A被唤醒，此时他会加入Lock自己的CLH队列中进行锁争用，当然也分为公平锁和非公平锁两种，和上面的描述一样。

Lock和condtion的组合广泛用于JUC包中，比如生产者和消费者模型，再比如cyliderbarrier。

###读写锁

读写锁也是Lock的一个子类，它在一个阻塞队列中同时存储读线程节点和写线程节点，读写锁采用state的高16位和低16位分别代表独占锁和共享锁的状态，如果共享锁的state > 0可以继续获取读锁，并且state-1，如果=0,则加入到阻塞队列中，写锁节点和独占锁的处理一样，因此一个队列中会有两种类型的节点，唤醒读锁节点时不会唤醒写锁节点，唤醒写锁节点时，则会唤醒后续的节点。

因此读写锁一般用于读多写少的场景，写锁可以降级为读锁，就是在获取到写锁的情况下可以再获取读锁。

## 并发工具类

countdownlatch主要通过AQS的共享模式实现，初始时设置state为N，N是countdownlatch初始化使用的size，每当有一个线程执行countdown，则state-1，state = 0之前所有线程阻塞在队列中，当state=0时唤醒队头节点，队头节点依次通知所有共享类型的节点，唤醒这些线程并执行后面的代码。

cycliderbarrier主要通过lock和condition结合实现，首先设置state为屏障等待的线程数，在某个节点设置一个屏障，所有线程运行到此处会阻塞等待，其实就是等待在一个condition的队列中，并且每当有一个线程到达，state -=1 则当所有线程到达时,state = 0，则唤醒condition队列的所有结点，去执行后面的代码。

samphere也是使用AQS的共享模式实现的，与countlatch大同小异，不再赘述。

exchanger就比较复杂了。使用exchanger时会开辟一段空间用来让两个线程进行交互操作，这个空间一般是一个栈或队列，一个线程进来时先把数据放到这个格子里，然后阻塞等待其他线程跟他交换，如果另一个线程也进来了，就会读取这个数据，并把自己的数据放到对方线程的格子里，然后双双离开。当然使用栈和队列的交互是不同的，使用栈的话匹配的是最晚进来的一个线程，队列则相反。

## 原子数据类型

原子数据类型基本都是通过cas操作实现的，避免并发操作时出现的安全问题。

## 同步容器

同步容器主要就是concurrenthashmap了，在集合类中我已经讲了chm了，所以在这里简单带过，chm1.7通过分段锁来实现锁粗化，使用的死LLock锁，而1.8则改用synchronized和cas的结合，性能更好一些。

还有就是concurrentlinkedlist，ConcurrentSkipListMap与CopyOnWriteArrayList。

第一个链表也是通过cas和synchronized实现。

而concurrentskiplistmap则是一个跳表，跳表分为很多层，每层都是一个链表，每个节点可以有向下和向右两个指针，先通过向右指针进行索引，再通过向下指针细化搜索，这个的搜索效率是很高的，可以达到logn，并且它的实现难度也比较低。通过跳表存map就是把entry节点放在链表中了。查询时按照跳表的查询规则即可。

CopyOnWriteArrayList是一个写时复制链表，查询时不加锁，而修改时则会复制一个新list进行操作，然后再赋值给原list即可。
适合读多写少的场景。

## 阻塞队列

        BlockingQueue 实现之 ArrayBlockingQueue
    
    ArrayBlockingQueue其实就是数组实现的阻塞队列，该阻塞队列通过一个lock和两个condition实现，一个condition负责从队头插入节点，一个condition负责队尾读取节点，通过这样的方式可以实现生产者消费者模型。   
        
        BlockingQueue 实现之 LinkedBlockingQueue
    
    LinkedBlockingQueue是用链表实现的阻塞队列，和arrayblockqueue有所区别，它支持实现为无界队列，并且它使用两个lock和对应的condition搭配使用，这是因为链表可以同时对头部和尾部进行操作，而数组进行操作后可能还要执行移位和扩容等操作。
    所以链表实现更灵活，读写分别用两把锁，效率更高。
        
        BlockingQueue 实现之 SynchronousQueue
     
     SynchronousQueue实现是一个不存储数据的队列，只会保留一个队列用于保存线程节点。详细请参加上面的exchanger实现类，它就是基于SynchronousQueue设计出来的工具类。
        
        BlockingQueue 实现之 PriorityBlockingQueue
        
        PriorityBlockingQueue
        
        PriorityBlockingQueue是一个支持优先级的无界队列。默认情况下元素采取自然顺序排列，也可以通过比较器comparator来指定元素的排序规则。元素按照升序排列。
        
        DelayQueue
        
        DelayQueue是一个支持延时获取元素的无界阻塞队列。队列使用PriorityQueue来实现。队列中的元素必须实现Delayed接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。我们可以将DelayQueue运用在以下应用场景：
        
        缓存系统的设计：可以用DelayQueue保存缓存元素的有效期，使用一个线程循环查询DelayQueue，一旦能从DelayQueue中获取元素时，表示缓存有效期到了。
        定时任务调度。使用DelayQueue保存当天将会执行的任务和执行时间，一旦从DelayQueue中获取到任务就开始执行，从比如TimerQueue就是使用DelayQueue实现的。

## 线程池

### 类图

首先看看executor接口，只提供一个run方法，而他的一个子接口executorservice则提供了更多方法，比如提交任务，结束线程池等。

然后抽象类abstractexecutorservice提供了更多的实现了，最后我们最常使用的类ThreadPoolExecutor就是继承它来的。


ThreadPoolExecutor可以传入多种参数来自定义实现线程池。

而我们也可以使用Executors中的工厂方法来实例化常用的线程池。

### 常用线程池

比如newFixedThreadPool

newSingleThreadExecutor newCachedThreadPool

newScheduledThreadPool等等，这些线程池即可以使用submit提交有返回结果的callable和futuretask任务，通过一个future来接收结果，或者通过callable中的回调函数call来回写执行结果。也可以用execute执行无返回值的runable任务。

在探讨这些线程池的区别之前，先看看线程池的几个核心概念。

任务队列：线程池中维护了一个任务队列，每当向线程池提交任务时，任务加入队列。

工作线程：也叫worker，从线程池中获取任务并执行，执行后被回收或者保留，因情况而定。

核心线程数和最大线程数，核心线程数是线程池需要保持存活的线程数量，以便接收任务，最大线程数是能创建的线程数上限。

newFixedThreadPool可以设置固定的核心线程数和最大线程数，一个任务进来以后，就会开启一个线程去执行，并且这部分线程不会被回收，当开启的线程达到核心线程数时，则把任务先放进任务队列。当任务队列已满时，才会继续开启线程去处理，如果线程总数打到最大线程数限制，任务队列又是满的时候，会执行对应的拒绝策略。

拒绝策略一般有几种常用的，比如丢弃任务，丢弃队尾任务，回退给调用者执行，或者抛出异常，也可以使用自定义的拒绝策略。

newSingleThreadExecutor是一个单线程执行的线程池，只会维护一个线程，他也有任务队列，当任务队列已满并且线程数已经是1个的时候，再提交任务就会执行拒绝策略。

newCachedThreadPool比较特别，第一个任务进来时会开启一个线程，而后如果线程还没执行完前面的任务又有新任务进来，就会再创建一个线程，这个线程池使用的是无容量的SynchronousQueue队列，要求请求线程和接受线程匹配时才会完成任务执行。
所以如果一直提交任务，而接受线程来不及处理的话，就会导致线程池不断创建线程，导致cpu消耗很大。

ScheduledThreadPoolExecutor内部使用的是delayqueue队列，内部是一个优先级队列priorityqueue，也就是一个堆。通过这个delayqueue可以知道线程调度的先后顺序和执行时间点。


## Fork/Join框架

又称工作窃取线程池。

我们在大学算法课本上，学过的一种基本算法就是：分治。其基本思路就是：把一个大的任务分成若干个子任务，这些子任务分别计算，最后再Merge出最终结果。这个过程通常都会用到递归。

而Fork/Join其实就是一种利用多线程来实现“分治算法”的并行框架。

另外一方面，可以把Fori/Join看作一个单机版的Map/Reduce，只不过这里的并行不是多台机器并行计算，而是多个线程并行计算。

与ThreadPool的区别
通过上面例子，我们可以看出，它在使用上，和ThreadPool有共同的地方，也有区别点： 
（1） ThreadPool只有“外部任务”，也就是调用者放到队列里的任务。 ForkJoinPool有“外部任务”，还有“内部任务”，也就是任务自身在执行过程中，分裂出”子任务“，递归，再次放入队列。 
（2）ForkJoinPool里面的任务通常有2类，RecusiveAction/RecusiveTask，这2个都是继承自FutureTask。在使用的时候，重写其compute算法。

工作窃取算法
上面提到，ForkJoinPool里有”外部任务“，也有“内部任务”。其中外部任务，是放在ForkJoinPool的全局队列里面，而每个Worker线程，也有一个自己的队列，用于存放内部任务。

窃取的基本思路就是：当worker自己的任务队列里面没有任务时，就去scan别的线程的队列，把别人的任务拿过来执行


